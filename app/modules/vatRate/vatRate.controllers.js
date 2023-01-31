const { mongodb } = require('@cowellness/cw-micro-service')()
/**
 * @class VatRateController
 * @classdesc Controller VatRate
 */
class VatRateController {
  constructor () {
    this.VatRate = mongodb.data.model('VatRate')
  }

  /**
   * Retrives all Vat Rates
   * @returns list of vat rates
   */
  find (countryId) {
    return this.VatRate.find({ countryId })
  }

  /**
   * Finds a single model by filter
   * @param {Object} filter model data
   */
  findOne (filter) {
    return this.VatRate.findOne(filter)
  }

  /**
   * Set other vatRates isDefault: false
   * @param {*} vatRateId
   * @returns
   */
  async setDefault (vatRateId, countryId) {
    await this.VatRate.updateMany({ isDefault: true, countryId }, { isDefault: false })
    return this.VatRate.updateOne({ _id: vatRateId }, { isDefault: true })
  }

  /**
   * Creates a Vat Rate model
   * @param {Object} data model data object
   * @returns created model
   */
  async create (data) {
    const vatRate = await this.VatRate.create(data)

    if (vatRate.isDefault) {
      await this.setDefault(vatRate._id, vatRate.countryId)
    }
    return vatRate
  }

  /**
   * Updates a model by provided filter
   * @param {Object} filter model object
   * @param {Object} data data to update with
   * @returns updated model
   */
  async findOneAndUpdate (filter, data) {
    const vatRate = await this.findOne(filter)

    if (!vatRate) {
      return null
    }
    vatRate.set(data)
    if (vatRate.isDefault) {
      await this.setDefault(vatRate._id, vatRate.countryId)
    }
    return vatRate.save()
  }

  /**
   * Removes a model by id
   * @param {String} id model objectid
   * @returns remove stats
   */
  delete (id) {
    return this.VatRate.deleteOne({ _id: id })
  }
}

module.exports = VatRateController
