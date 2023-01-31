const { mongodb, redis, _, ctr } = require('@cowellness/cw-micro-service')()
const constants = require('./termsAndConditions.constants')
/**
 * @class TermsAndConditionsController
 * @classdesc Controller TermsAndConditions
 */
class TermsAndConditionsController {
  constructor () {
    this.TermsAndConditions = mongodb.data.model('TermsAndConditions')
  }

  /**
   * Retrives all TermsAndConditions grouped by area
   */
  async find (countryId) {
    const list = await this.TermsAndConditions.find({ countryId })
    const groupedAreas = _.groupBy(list, item => item.area)

    return Object.values(constants.areas).map(area => {
      area.data = groupedAreas[area.name] || []
      return area
    })
  }

  /**
   * Get document by Id
   * @param {ObjectId} id Document Id
   */
  findById (id) {
    return this.TermsAndConditions.findById(id).lean().exec()
  }

  /**
   * Gets a single model
   * @param {Object} filter
   * @returns filtered model
   */
  findOne (filter) {
    return this.TermsAndConditions.findOne(filter)
  }

  /**
   * Increments the `accepted` property by 1
   * @param {String} id Model id
   * @returns updated model
   */
  async incrementAccepted (id) {
    return this.findOneAndUpdate({ _id: id }, {
      $inc: {
        accepted: 1
      }
    })
  }

  /**
   * Creates a new entry
   * @param {Object} data Model properties to create
   * @returns created model
   */
  async create (data) {
    data.progressive = await this.setProgressiveNumber(data.countryId, data.area)
    return this.TermsAndConditions.create(data)
  }

  /**
   * Updates one entry
   * @param {Object} filter Model filter properties
   * @param {Object} data Model properties to update
   * @returns updated model
   */
  async findOneAndUpdate (filter, data) {
    const item = await this.TermsAndConditions.findOne(filter)

    if (!item) {
      return null
    }
    item.set(data)
    return item.save()
  }

  /**
   * Creates a redis entry with auto progressive number
   * @param {String} countryId
   * @param {String} area
   * @returns progressive number
   */
  async setProgressiveNumber (countryId, area) {
    const key = `countries:termsAndConditions:progressive:${countryId}:${area}`
    const isSet = await redis.get(key)

    if (!isSet) {
      const lastRow = await this.findOne({
        countryId,
        area
      }).sort({ progressive: -1 })

      if (lastRow) {
        await redis.set(key, lastRow.progressive)
      }
    }
    return redis.incr(key)
  }

  /**
   * Deactivates by specified filter
   *
   * @param {Object} filter query to find
   * @returns updated models
   */
  async deactivateBy (filter) {
    const items = await this.TermsAndConditions.find(filter)
    const promises = items.map(item => {
      item.set('expiredAt', Date.now())
      return item.save()
    })

    return Promise.all(promises)
  }

  /**
   * Sets models to be active
   *
   * @param {String} id model _id
   * @returns activated model
   */
  async activate (id) {
    const item = await this.TermsAndConditions.findOne({ _id: id })
    if (!item) {
      return null
    }
    item.activatedAt = Date.now()
    item.expiredAt = null
    const previous = await this.TermsAndConditions.findOne({ status: 'active', countryId: item.countryId, area: item.area }).lean().exec()
    await this.deactivateBy({ area: item.area, countryId: item.countryId, _id: { $ne: item._id }, status: 'active' })
    const savedItem = await item.save()

    if (previous) {
      await ctr.roleDocuments.sendNewDocActivation(previous._id.toString(), item._id.toString(), 'terms', item.area, item.preApproval)
    }
    return savedItem
  }

  /**
   * Delete a document by id
   * @param {string} id model id
   * @returns delete stats
   */
  delete (id) {
    return this.TermsAndConditions.deleteOne({ _id: id })
  }

  /**
   * Get active document for terms
   * @param {ObjectId} countryId
   * @returns
   */
  getActiveDocument (countryId) {
    return this.TermsAndConditions.find({ status: 'active', countryId: countryId }).lean().exec()
  }
}

module.exports = TermsAndConditionsController
