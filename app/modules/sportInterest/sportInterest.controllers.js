const { mongodb, _, ctr } = require('@cowellness/cw-micro-service')()
/**
 * @class SportInterestController
 * @classdesc Controller SportInterest
 */
class SportInterestController {
  constructor () {
    this.SportInterest = mongodb.data.model('SportInterest')
  }

  /**
   * Retrives all sportInterests with grouped translations for other languages
   */
  async find (filter) {
    const sportInterests = await this.SportInterest.find(filter).lean()
    const entries = await ctr.i18nEntry.find({ key: /^_sportinterest/ })
    const result = sportInterests.map(interest => {
      const key = this.translationKey(interest.name)
      const entry = entries.find(t => t.key === key)

      interest.translations = _.get(entry, 'translations', {})
      return interest
    })

    return result
  }

  /**
   * Retrives a sportInterest with grouped translations for other languages
   */
  async findOne (filter) {
    const sportInterest = await this.SportInterest.findOne(filter)

    if (sportInterest) {
      const key = this.translationKey(sportInterest.name)
      const entries = await ctr.i18nEntry.find({ key })
      const translations = entries.reduce((result, current) => {
        result[current.language] = current.value
        return result
      }, {})

      return {
        ...sportInterest.toJSON(),
        translations
      }
    }
    return null
  }

  /**
   * Creates sport interest provided data with translations
   * @param {object} data sport interest model with translations
   * @example
   * {
      "name": "Football",
      "translations": {
        "it": "Football"
      }
     }
   */
  async create (data) {
    if (data.parentId && mongodb.data.isValidObjectId(data.parentId)) {
      const parentExists = await this.SportInterest.findOne({ _id: data.parentId })

      if (!parentExists) {
        data.parentId = null
      }
    }

    const sportInterest = await this.SportInterest.create({
      coniId: data.coniId,
      name: data.name,
      parentId: data.parentId
    })
    const key = this.translationKey(data.name)

    if (data.translations) {
      data.translations.en = data.name
      await ctr.i18nEntry.updateOrCreate({
        key
      }, {
        key,
        translations: data.translations
      })
    }
    return {
      ...sportInterest.toJSON(),
      translations: data.translations
    }
  }

  /**
  * Tries to find a sport interest by filter and updates with data
  * @param {object} filter the object to filter with
  * @param {object} data the object to update with
  * @example
  * {
      "name": "Football",
      "translations": {
        "it": "Football"
      }
    }
  */
  async findOneAndUpdate (filter, data) {
    const sportInterest = await this.SportInterest.findOne(filter)

    if (sportInterest) {
      const oldKey = this.translationKey(sportInterest.name)
      const newKey = this.translationKey(data.name)
      await ctr.i18nEntry.delete({ key: oldKey })
      if (data.translations) {
        data.translations.en = data.name
        await ctr.i18nEntry.create({
          key: newKey,
          translations: data.translations
        })
      }
      Object.assign(sportInterest, data)
      await sportInterest.save()
      return {
        ...sportInterest.toJSON(),
        translations: data.translations
      }
    }
    return null
  }

  /**
   * Deletes a sport interest by id
   * @param {*} id model id
   */
  async delete (id) {
    const sportInterest = await this.SportInterest.findOne({ _id: id })
    const children = await this.SportInterest.find({ parentId: id })

    if (children.length) {
      return null
    }
    if (sportInterest) {
      const key = this.translationKey(sportInterest.name)

      await ctr.i18nEntry.delete({ key })
    }

    return this.SportInterest.deleteOne({ _id: id })
  }

  /**
   * converts a name to translation key
   * @param {string} name
   */
  translationKey (name) {
    const slug = _.kebabCase(name)

    return (`_sportinterest.${slug}`)
  }
}

module.exports = SportInterestController
