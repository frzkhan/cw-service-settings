const crypto = require('crypto')
const { mongodb, redisJson, _ } = require('@cowellness/cw-micro-service')()
/**
 * @class I18nController
 * @classdesc Controller I18n
 */
class I18nController {
  constructor () {
    this.I18n = mongodb.data.model('I18n')
    this.I18nEntry = mongodb.data.model('I18nEntry')
  }

  find () {
    return this.I18n.find({})
  }

  async findByLang (language, query) {
    const enTranslations = await redisJson.get('i18n_json_en')
    const translations = await redisJson.get(`i18n_json_${language}`)

    if (!enTranslations || !translations) {
      return null
    }
    translations.value = Object.assign(enTranslations.value, translations.value)
    if (query) {
      translations.value = _.pickBy(translations.value, (value, key) => key.startsWith(query))
    }
    return translations
  }

  async generateJSON (language) {
    const i18n = await this.I18n.findOne({ language })

    if (!i18n) {
      return null
    }

    const i18nEntry = await this.I18nEntry.find({
      [`translations.${language}`]: {
        $exists: true
      }
    })
    const value = {}
    i18nEntry.forEach(e => {
      value[e.key] = e.translations[language]
    })

    const date = new Date().toISOString()
    const md5 = crypto.createHash('md5').update(date).digest('hex')
    const data = {
      _id: i18n._id.toString(),
      active: i18n.active,
      label: i18n.label,
      key: i18n.key,
      language: i18n.language,
      md5,
      value
    }
    await redisJson.set(`i18n_json_${language}`, data)
    return data
  }

  async findOrCreate (filter, data) {
    let i18nData = await this.I18n.findOne(filter)

    if (!i18nData) {
      i18nData = await this.I18n.create(data)
    }
    return i18nData
  }
}

module.exports = I18nController
