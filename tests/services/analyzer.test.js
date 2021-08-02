const Analyzer = require('../../services/analyzer')
const { assert, expect } = require('chai')

describe('Analyzer', () => {
  let analyzer
  beforeEach(() => {
    analyzer = new Analyzer()
  })

  it('should detect intersection', () => {
    const r1 = { left: 0, right: 10, bottom: 0, top: 10 }
    const r2 = { left: 5, right: 10, bottom: 0, top: 10 }
    const result = analyzer.analyse([r1, r2])
    assert.deepEqual(result, { message: 'Intersection' })
  })

  it('should detect containment', () => {
    const r1 = { left: 0, right: 10, bottom: 0, top: 10 }
    const r2 = { left: 5, right: 8, bottom: 5, top: 8 }
    const result = analyzer.analyse([r1, r2])
    assert.deepEqual(result, { message: 'Containment' })

    const result2 = analyzer.analyse([r2, r1])
    assert.deepEqual(result2, { message: 'Containment' })
  })

  it('should detect proper adjacency', () => {
    const r1 = { left: 0, right: 10, bottom: 0, top: 10 }
    const r2 = { left: 10, right: 20, bottom: 0, top: 10 }
    const result = analyzer.analyse([r1, r2])
    assert.deepEqual(result, { message: 'Proper adjacency' })
  })

  it('should detect subLine adjacency', () => {
    const r1 = { left: 0, right: 10, bottom: 0, top: 10 }
    const r2 = { left: 10, right: 20, bottom: 0, top: 5 }
    const result = analyzer.analyse([r1, r2])
    assert.deepEqual(result, { message: 'SubLine adjacency' })
  })

  it('should detect partial adjacency', () => {
    const r1 = { left: 0, right: 10, bottom: 0, top: 10 }
    const r2 = { left: 10, right: 20, bottom: 0, top: 15 }
    const result = analyzer.analyse([r1, r2])
    assert.deepEqual(result, { message: 'Partial adjacency' })
  })

  it('should detect partial adjacency (top/bottom edge adjacency)', () => {
    const r1 = { left: 5, right: 10, bottom: 0, top: 10 }
    const r2 = { left: 0, right: 10, bottom: 10, top: 30 }
    const result = analyzer.analyse([r1, r2])
    assert.deepEqual(result, { message: 'Partial adjacency' })
  })

  it('should detect no feature', () => {
    const r1 = { left: 0, right: 10, bottom: 0, top: 10 }
    const r2 = { left: 15, right: 20, bottom: 0, top: 15 }
    const result = analyzer.analyse([r1, r2])
    assert.deepEqual(result, { message: 'No feature' })
  })

  describe('Invalid payload', () => {
    it('should error if payload is empty', () => {
      expect(() => analyzer.analyse([])).to.throw('Payload is empty')
    })

    it('should error if payload is not an array of recs', () => {
      expect(() => analyzer.analyse({ a: 1 })).to.throw('Expecting an array of rectangles')
    })

    it('should error if there are more than 2 recs to check', () => {
      expect(() => analyzer.analyse([1, 2, 3])).to.throw('Expecting 2 rectangles to check')
    })

    it('should error if rec is invalid', () => {
      expect(() => analyzer.analyse([1, 2])).to.throw('Invalid rectangle object')
    })

    it('should error if rec missing top/bottom/left/right', () => {
      expect(() => analyzer.analyse([{}, {}])).to.throw('Invalid rectangle, top/bottom/left/right must exist')
    })

    it('should error if top/bottom/left/right are not integer', () => {
      const r1 = { left: 0, right: 0.01, bottom: 0, top: 10 }
      const r2 = { left: 10, right: 20, bottom: 0, top: 15 }
      expect(() => analyzer.analyse([r1, r2])).to.throw('Invalid rectangle, top/bottom/left/right must be integer')
    })

    it('should error if rec data is invalid', () => {
      const r1 = { left: 0, right: -1, bottom: 0, top: 10 }
      const r2 = { left: 10, right: 20, bottom: 0, top: 15 }
      expect(() => analyzer.analyse([r1, r2])).to.throw('Invalid rectangle data')
    })
  })
})
