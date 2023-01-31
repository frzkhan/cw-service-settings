const { parse } = require('json2csv')
const csvtojson = require('csvtojson')
const { mongodb, _, ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class I18nController
 * @classdesc Controller I18n
 */
class I18nEntryController {
  constructor () {
    this.I18nEntry = mongodb.data.model('I18nEntry')
    this.I18n = mongodb.data.model('I18n')
  }
  /*
  * Retrives all i18nEntry
  */

  async find (filter) {
    return this.I18nEntry.find(filter)
  }

  /**
   * Creates i18nEntry
   * @param {object} data i18nEntry model object
   */

  async create (data) {
    const i18nEntry = await this.I18nEntry.create(data)
    this.updateRedis(Object.keys(i18nEntry.translations))
    return i18nEntry
  }

  /**
  * Tries to find an entry by filter and updates with data
  * @param {object} filter the object to filter with
  * @param {object} data the object to update with
  */

  async findOneAndUpdate (filter, data) {
    const i18nEntry = await this.I18nEntry.findOne(filter)

    if (i18nEntry) {
      i18nEntry.set(data)
      const entry = await i18nEntry.save()
      this.updateRedis(Object.keys(i18nEntry.translations))
      return entry
    }
    return null
  }

  /**
   * Creates a csv string of data for i18nEntry
   * @param {string} language en, it
   */
  async exportCSV (language) {
    const i18nEntry = await this.I18nEntry.find({
      'translations.en': {
        $exists: true
      }
    })
    const exportData = []

    i18nEntry.forEach(item => {
      exportData.push({
        key: item.key,
        'en-referral': item.translations.en,
        [`${language}-actual`]: item.translations[language],
        [`${language}-new`]: null
      })
    })
    const csv = parse(exportData)

    return csv
  }

  /**
   * Imports a csv string exported with export method
   * @param {string} csv
   */

  async importCSV (data) {
    const csvData = Buffer.from(data, 'base64').toString()
    const csvJson = await csvtojson().fromString(csvData)
    const headers = _.keys(_.first(csvJson))
    const language = headers && headers[2] ? _.first(headers[2].split('-')) : null
    const i18nLanguage = await this.I18n.findOne({ language })

    if (!i18nLanguage) {
      return null
    }
    const promises = []

    csvJson.forEach(item => {
      const enValue = item['en-referral']
      const translatedValue = item[`${language}-new`]

      if (translatedValue) {
        const entry = this.I18nEntry.findOne({ key: item.key })
          .then(i18nEntry => {
            if (!i18nEntry) {
              return this.create({
                key: item.key,
                translations: {
                  en: enValue,
                  [language]: translatedValue
                }
              })
            }
            i18nEntry.set({
              [`translations.${language}`]: translatedValue
            })
            return i18nEntry.save()
          })

        promises.push(entry)
      }
    })
    const imported = await Promise.all(promises)

    this.updateRedis([language])

    return imported
  }

  /**
   *
   * @param {object} filter the object to filter with
   * @param {object} data the object to create i18nEntry
   */
  async findOrCreate (filter, data) {
    const i18nData = await this.I18nEntry.findOne(filter)

    if (!i18nData) {
      return this.create(data)
    }
    return i18nData
  }

  /**
   *
   * @param {object} filter the object to filter with
   * @param {object} data the object to create/update translation
   */
  async updateOrCreate (filter, data) {
    const i18nData = await this.I18nEntry.findOne(filter)

    if (!i18nData) {
      return this.create(data)
    }
    i18nData.set(data)
    return i18nData.save()
  }

  /**
   * Deletes data from model
   * @param {object} filter the delete filter
   */
  async delete (filter) {
    const i18nEntry = await this.I18nEntry.findOne(filter)

    if (i18nEntry) {
      this.updateRedis(Object.keys(i18nEntry.translations))
    }
    const deleted = await this.I18nEntry.deleteMany(filter)

    return deleted
  }

  updateRedis (languages) {
    languages.forEach(language => {
      ctr.i18n.generateJSON(language)
    })
  }
}

module.exports = I18nEntryController
