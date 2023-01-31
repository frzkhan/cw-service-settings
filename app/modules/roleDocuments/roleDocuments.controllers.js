const { mongodb, redis, _, ctr, rabbitmq } = require('@cowellness/cw-micro-service')()
const constants = require('./roleDocuments.constants')
/**
 * @class RoleDocumentsController
 * @classdesc Controller RoleDocuments
 */
class RoleDocumentsController {
  constructor () {
    this.RoleDocuments = mongodb.data.model('RoleDocuments')
  }

  /**
   * Retrives all by country id grouped by area
   * @param countryId country id
   * @returns grouped by area
   */
  async find (countryId) {
    const list = await this.RoleDocuments.find({ countryId })
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
    return this.RoleDocuments.findById(id).lean().exec()
  }

  /**
   * Finds a model with filter specified
   * @param {Object} filter data to filter with
   * @returns model data
   */
  findOne (filter) {
    return this.RoleDocuments.findOne(filter)
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
    return this.RoleDocuments.create(data)
  }

  /**
   * Updates one entry
   * @param {Object} filter Model filter properties
   * @param {Object} data Model properties to update
   * @returns updated model
   */
  async findOneAndUpdate (filter, data) {
    const item = await this.RoleDocuments.findOne(filter)

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
    const key = `countries:roleDocuments:progressive:${countryId}:${area}`
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
    const items = await this.RoleDocuments.find(filter)
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
    const item = await this.RoleDocuments.findOne({ _id: id })
    if (!item) {
      return null
    }
    const previous = await this.RoleDocuments.findOne({ countryId: item.countryId, status: 'active', area: item.area }, '_id').lean().exec()
    item.activatedAt = Date.now()
    item.expiredAt = null

    await this.deactivateBy({ area: item.area, countryId: item.countryId, _id: { $ne: item._id }, status: 'active' })
    const savedItem = await item.save()
    if (previous) {
      await this.sendNewDocActivation(previous._id.toString(), item._id.toString(), 'role', item.area, item.preApproval)
    }
    return savedItem
  }

  /**
   * Delete a document by id
   * @param {string} id model id
   * @returns delete stats
   */
  delete (id) {
    return this.RoleDocuments.deleteOne({ _id: id })
  }

  /**
   * Get active document for role
   * @param {ObjectId} countryId
   * @returns
   */
  getActiveDocument (countryId) {
    return this.RoleDocuments.find({ status: 'active', countryId: countryId }).lean().exec()
  }

  /**
   * Get active document for Role, privacy, terms specific to country
   * @param {string} countryCode country code of the country
   */
  async getActiveDocumentList (countryCode) {
    let activeDocuments = []
    const country = await ctr.countries.getByCode(countryCode)
    if (!country) throw new Error('No country information available')
    let [role, privacy, terms] = await Promise.all([this.getActiveDocument(country._id.toString()), ctr.privacyPolicy.getActiveDocument(country._id.toString()), ctr.termsAndConditions.getActiveDocument(country._id.toString())])
    if (role && role.length) {
      role = role.map((r) => {
        r.type = 'role'
        return r
      })
      activeDocuments = activeDocuments.concat(role)
    }
    if (terms && terms.length) {
      terms = terms.map((t) => {
        t.type = 'term'
        return t
      })
      activeDocuments = activeDocuments.concat(terms)
    }
    if (privacy && privacy.length) {
      privacy = privacy.map((p) => {
        p.type = 'privacy'
        return p
      })
      activeDocuments = activeDocuments.concat(privacy)
    }
    return activeDocuments
  }

  /**
   * Get document by ID
   */
  async getDocumentById (id) {
    const [terms, privacy, role] = await Promise.all([ctr.termsAndConditions.findById(id), ctr.privacyPolicy.findById(id), this.findById(id)])
    if (terms) terms.type = 'term'
    if (privacy) privacy.type = 'privacy'
    if (role) role.type = 'role'
    return terms || privacy || role
  }

  async sendNewDocActivation (previousId, currentId, type, role, preApproval) {
    await rabbitmq.send('/settings/contract/active/new/', { previousId, currentId, type, role, preApproval })
  }
}

module.exports = RoleDocumentsController
