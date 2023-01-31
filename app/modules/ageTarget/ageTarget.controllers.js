const { mongodb, _, ctr } = require('@cowellness/cw-micro-service')()
const constants = require('./ageTarget.constants')
/**
 * @class AgeTargetController
 * @classdesc Controller AgeTarget
 */
class AgeTargetController {
  constructor () {
    this.AgeTarget = mongodb.data.model('AgeTarget')
  }

  /**
   * Retrives all AgeTarget grouped by area
   */
  async find (countryId) {
    const entries = Object.keys(constants.areas).map(area => {
      return this.findOrCreate({ countryId, area }, { countryId, area, age: constants.defaultAge })
    })
    const ageTarget = await Promise.all(entries)
    const mappedKeys = []

    ageTarget.forEach(item => {
      const data = _.pick(item, ['_id', 'countryId', 'area', 'age', 'accepted', 'activatedAt', 'expiredAt'])

      mappedKeys.push({
        area: item.area,
        data: [data],
        label: constants.areas[item.area].label,
        key: constants.areas[item.area].key,
        prefix: constants.areas[item.area].prefix
      })
    })

    return mappedKeys
  }

  /**
   * Finds a document, if not found creates it
   * @param {Object} filter
   * @param {Object} data
   * @returns age target document
   */
  async findOrCreate (filter, data) {
    const ageTarget = await this.AgeTarget.findOne(filter)

    if (ageTarget) {
      return ageTarget
    }
    return this.AgeTarget.create(data)
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
   * Updates one entry
   * @param {Object} filter Model filter properties
   * @param {Object} data Model properties to update
   * @returns updated model
   */
  async findOneAndUpdate (filter, data) {
    const item = await this.AgeTarget.findOne(filter)

    if (!item) {
      return null
    }
    item.set(data)
    return item.save()
  }

  async getEmancipationAge (countryCode) {
    const country = await ctr.countries.getByCode(countryCode)

    if (!country) {
      return null
    }

    const ageTarget = await this.AgeTarget.findOne({
      countryId: country._id,
      area: 'emancipation'
    })

    return _.get(ageTarget, 'age', null)
  }
}

module.exports = AgeTargetController
