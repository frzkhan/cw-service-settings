const { mongodb, _, ctr } = require('@cowellness/cw-micro-service')()
/**
 * @class TermsOfPaymentController
 * @classdesc Controller TermsOfPayment
 */
class TermsOfPaymentController {
  constructor () {
    this.TermsOfPayment = mongodb.data.model('TermsOfPayment')
  }

  /**
   * Retrives all TermsOfPayment with grouped translations for other languages
   */
  async find () {
    const termsOfPayment = await this.TermsOfPayment.find({}).lean()
    const entries = await ctr.i18nEntry.find({ key: /^_terms-of-payment/ })
    const result = termsOfPayment.map(item => {
      const key = this.translationKey(item.name)
      const entry = entries.find(t => t.key === key)

      item.translations = _.get(entry, 'translations', {})
      return item
    })

    return result
  }

  /**
   * Finds one termsOfPayment by filter
   * @param {*} filter the object to filter with
   */
  async findOne (filter) {
    const termsOfPayment = await this.TermsOfPayment.findOne(filter).lean()
    if (!termsOfPayment) {
      return null
    }
    const key = this.translationKey(termsOfPayment.name)
    const translations = await ctr.i18nEntry.find({ key })
    termsOfPayment.translations = translations.reduce((result, current) => {
      result[current.language] = current.value
      return result
    }, {})
    return termsOfPayment
  }

  /**
   * Creates Terms Of Payment provided data with translations
   * @param {object} data Terms Of Payment model with translations
   * @example
   * {
      "name": "Immediate",
      "day": "30",
      "isEom": true,
      "translations": {
        "it": "Immediate"
      }
     }
   */
  async create (data) {
    const termsOfPayment = await this.TermsOfPayment.create({
      name: data.name,
      day: data.day,
      isEom: data.isEom
    })
    const key = this.translationKey(data.name)

    if (data.translations) {
      data.translations.en = data.name
      await ctr.i18nEntry.create({
        key,
        translations: data.translations
      })
    }
    return {
      ...termsOfPayment.toJSON(),
      translations: data.translations
    }
  }

  /**
  * Tries to find a termsOfPayment by filter and updates with data
  * @param {object} filter the object to filter with
  * @param {object} data the object to update with
  * @example
  * {
      "name": "Immediate",
      "day": "30",
      "isEom": true,
      "translations": {
        "it": "Immediate"
      }
     }
  */
  async findOneAndUpdate (filter, data) {
    const termsOfPayment = await this.TermsOfPayment.findOne(filter)

    if (termsOfPayment) {
      const oldKey = this.translationKey(termsOfPayment.name)
      const newKey = this.translationKey(data.name)
      await ctr.i18nEntry.delete({ key: oldKey })
      if (data.translations) {
        data.translations.en = data.name
        await ctr.i18nEntry.create({
          key: newKey,
          translations: data.translations
        })
      }
      termsOfPayment.set(data)
      await termsOfPayment.save()
      return {
        ...termsOfPayment.toJSON(),
        translations: data.translations
      }
    }
    return null
  }

  /**
   * Deletes a termsOfPayment by id
   * @param {*} id model id
   */
  async delete (id) {
    const termsOfPayment = await this.TermsOfPayment.findOne({ _id: id })

    if (termsOfPayment) {
      const key = this.translationKey(termsOfPayment.name)
      await ctr.i18nEntry.delete({ key })
    }

    return this.TermsOfPayment.deleteOne({ _id: id })
  }

  /**
   * converts a name to translation key
   * @param {string} name
   */
  translationKey (name) {
    const slug = _.kebabCase(name)

    return (`_terms-of-payment.${slug}`)
  }
}

module.exports = TermsOfPaymentController
