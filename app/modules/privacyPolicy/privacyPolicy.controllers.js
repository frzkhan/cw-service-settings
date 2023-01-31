const { mongodb, redis, _, ctr } = require('@cowellness/cw-micro-service')()
const constants = require('./privacyPolicy.constants')

/**
 * @class PrivacyPolicyController
 * @classdesc Controller PrivacyPolicy
 */
class PrivacyPolicyController {
  constructor () {
    this.PrivacyPolicy = mongodb.data.model('PrivacyPolicy')
  }

  /**
   * Retrives all by country id grouped by area
   * @param countryId country id
   * @returns grouped by area
   */
  async find (countryId) {
    const list = await this.PrivacyPolicy.find({ countryId })
    const groupedAreas = _.groupBy(list, item => item.area)

    return Object.values(constants.areas).map(area => {
      area.data = groupedAreas[area.name] || []
      return area
    })
  }

  /**
   * Finds a model with filter specified
   * @param {Object} filter data to filter with
   * @returns model data
   */
  findOne (filter) {
    return this.PrivacyPolicy.findOne(filter)
  }

  /**
   * Get document by Id
   * @param {ObjectId} id Document Id
   */
  findById (id) {
    return this.PrivacyPolicy.findById(id).lean().exec()
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
    return this.PrivacyPolicy.create(data)
  }

  /**
   * Updates one entry
   * @param {Object} filter Model filter properties
   * @param {Object} data Model properties to update
   * @returns updated model
   */
  async findOneAndUpdate (filter, data) {
    const item = await this.PrivacyPolicy.findOne(filter)

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
    const key = `countries:privacyPolicy:progressive:${countryId}:${area}`
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
    const items = await this.PrivacyPolicy.find(filter)
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
    const item = await this.PrivacyPolicy.findOne({ _id: id })
    if (!item) {
      return null
    }
    item.activatedAt = Date.now()
    item.expiredAt = null
    const previous = await this.PrivacyPolicy.findOne({ status: 'active', countryId: item.countryId, area: item.area }).lean().exec()
    await this.deactivateBy({ area: item.area, countryId: item.countryId, _id: { $ne: item._id }, status: 'active' })
    const savedItem = await item.save()
    if (previous) {
      await ctr.roleDocuments.sendNewDocActivation(previous._id.toString(), item._id.toString(), 'privacy', item.area, item.preApproval)
    }
    return savedItem
  }

  /**
   * Delete a document by id
   * @param {string} id model id
   * @returns delete stats
   */
  delete (id) {
    return this.PrivacyPolicy.deleteOne({ _id: id })
  }

  /**
   * Get active document for privacy
   * @param {ObjectId} countryId
   * @returns
   */
  getActiveDocument (countryId) {
    return this.PrivacyPolicy.find({ status: 'active', countryId: countryId }).lean().exec()
  }
}

module.exports = PrivacyPolicyController
