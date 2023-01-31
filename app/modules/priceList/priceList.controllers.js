const { mongodb, redis, _ } = require('@cowellness/cw-micro-service')()
const constants = require('./priceList.constants')
/**
 * @class PriceListController
 * @classdesc Controller PriceList
 */
class PriceListController {
  constructor () {
    this.PriceList = mongodb.data.model('PriceList')
  }

  /**
   * Retrives all PriceList grouped by area
   */
  async find (countryId) {
    const list = await this.PriceList.find({ countryId })
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
    return this.PriceList.findOne(filter)
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
    return this.PriceList.create(data)
  }

  /**
   * Updates one entry
   * @param {Object} filter Model filter properties
   * @param {Object} data Model properties to update
   * @returns updated model
   */
  async findOneAndUpdate (filter, data) {
    const item = await this.PriceList.findOne(filter)

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
    const key = `countries:priceList:progressive:${countryId}:${area}`
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
    const items = await this.PriceList.find(filter)
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
    const item = await this.PriceList.findOne({ _id: id })
    if (!item) {
      return null
    }
    item.activatedAt = Date.now()
    item.expiredAt = null

    await this.deactivateBy({ area: item.area, countryId: item.countryId, _id: { $ne: item._id }, status: 'active' })
    return item.save()
  }

  /**
   * Delete a document by id
   * @param {string} id model id
   * @returns delete stats
   */
  delete (id) {
    return this.PriceList.deleteOne({ _id: id })
  }
}

module.exports = PriceListController
