const { makeError } = require('../services/utils')
const { isArray, isEmpty, isNil, isObject, isInteger } = require('lodash')

class Analyser {
  /**
   * Determine if 2 rectangles intersect
   * @param {Object} r1 - Rectangle 1
   * @param {Object} r2 - Rectangle 2
   * @returns {Boolean} Returns true if intersection detected
   */
  intersection (r1, r2) {
    const notIntersecting = r2.left >= r1.right || r2.right <= r1.left || r2.bottom >= r1.top || r2.top <= r1.bottom
    return !notIntersecting && !this.containment(r1, r2)
  }

  /**
   * Determine if one rectangle contains the other one
   * @param {Object} r1 - Rectangle 1
   * @param {Object} r2 - Rectangle 2
   * @returns {Boolean} Returns true if containment detected
   */
  containment (r1, r2) {
    const r1ContainsR2 = r1.left < r2.left && r1.right > r2.right && r1.top > r2.top && r1.bottom < r2.bottom
    const r2ContainsR1 = r2.left < r1.left && r2.right > r1.right && r2.top > r1.top && r2.bottom < r1.bottom
    return r1ContainsR2 || r2ContainsR1
  }

  /**
   * Determine adjacency between 2 rectangles
   * @param {Object} r1 - Rectangle 1
   * @param {Object} r2 - Rectangle 2
   * @returns {String} Returns adjacency state
   */
  adjacency (r1, r2) {
    const leftAdjacency = r1.left === r2.right
    const rightAdjacency = r1.right === r2.left

    const topAdjacency = r1.top === r2.bottom
    const bottomAdjacency = r1.bottom === r2.top

    let highEdge, lowEdge
    if (leftAdjacency || rightAdjacency) {
      highEdge = 'top'
      lowEdge = 'bottom'
    } else if (topAdjacency || bottomAdjacency) {
      highEdge = 'right'
      lowEdge = 'left'
    } else {
      return
    }

    if (r1[highEdge] === r2[highEdge] && r1[lowEdge] === r2[lowEdge]) {
      return 'Proper adjacency'
    }
    if (r1[highEdge] >= r2[highEdge] && r1[lowEdge] <= r2[lowEdge]) {
      return 'SubLine adjacency'
    }
    if (r1[highEdge] < r2[highEdge] || r1[lowEdge] > r2[lowEdge]) {
      return 'Partial adjacency'
    }
  }

  /**
   * Validates the payload
   * @param {Object} payload - Payload
   * @throws Will throw an error if payload is invalid
   */
  _validatePayload (payload) {
    if (isEmpty(payload)) {
      throw makeError('Payload is empty', 400)
    }

    if (!isArray(payload)) {
      throw makeError('Expecting an array of rectangles', 400)
    }

    if (payload.length !== 2) {
      throw makeError('Expecting 2 rectangles to check', 400)
    }

    payload.forEach(rec => {
      if (!isObject(rec)) {
        throw makeError('Invalid rectangle object', 400)
      }

      const { top, bottom, left, right } = rec
      const missingField = isNil(top) || isNil(bottom) || isNil(left) || isNil(right)
      if (missingField) {
        throw makeError('Invalid rectangle, top/bottom/left/right must exist', 400)
      }

      const allInteger = isInteger(top) && isInteger(bottom) && isInteger(left) && isInteger(right)
      if (!allInteger) {
        throw makeError('Invalid rectangle, top/bottom/left/right must be integer', 400)
      }

      if (top <= bottom || left >= right) {
        throw makeError('Invalid rectangle data', 400)
      }
    })
  }

  /**
   * Analyses the payload
   * @param {Object} payload - Payload
   * @returns {Object} Returns the result
   */
  analyse (payload) {
    this._validatePayload(payload)
    const processed = payload.map((rec, id) => {
      return { id, width: rec.right - rec.left, height: rec.top - rec.bottom, ...rec }
    })

    if (this.containment(processed[0], processed[1])) {
      return { message: 'Containment' }
    }

    if (this.intersection(processed[0], processed[1])) {
      return { message: 'Intersection' }
    }

    const adjacencyMessage = this.adjacency(processed[0], processed[1])
    if (adjacencyMessage) {
      return { message: adjacencyMessage }
    }

    return { message: 'No feature' }
  }
}

module.exports = Analyser
