const { parse } = require('json2csv')
const csvtojson = require('csvtojson')
const { db, _ } = require('@cowellness/cw-micro-service')()

/**
 * @class MessagesController
 * @classdesc Controller Messages
 */
class MessagesController {
  constructor () {
    this.Messages = db.data.model('Messages')
  }

  /**
   * Fetch all messages
   * @returns a list of messages
   */
  find () {
    return this.Messages.find()
  }

  /**
   * Returns the compiled message for a language
   * @param {Object} filter data to find
   * @returns compiled message
   */
  async getMessage (filter) {
    const message = await this.Messages.findOne({
      key: filter.key,
      type: filter.type
    })

    if (!message) {
      return null
    }
    let content = _.get(message, `messages.${filter.language}`)

    if (!content) {
      content = _.get(message, 'messages.en')
    }
    if (content) {
      return this.compileTemplate(content, filter.data)
    }

    return null
  }

  /**
   * Compile a template to variables
   * @param {String} template message content
   * @param {Object} data the variables to compile
   * @returns compiled message
   */
  compileTemplate (template, data) {
    if (data) {
      Object.keys(data).forEach(key => {
        const regEx = new RegExp(_.escapeRegExp(`[[${key}]]`), 'gi')
        const tagRegEx = new RegExp(`<span data-field="${key}"((?!<span).)+/span>`, 'gi')

        template = template.replace(tagRegEx, data[key])
        template = template.replace(regEx, data[key])
      })
    }

    return template
  }

  /**
   * Create a message model
   * @param {Object} data message model data
   * @returns created message model
   */
  create (data) {
    return this.Messages.create(data)
  }

  /**
   * Find and update a message model
   * @param {Object} filter filter query
   * @param {Object} data message model data
   * @returns updated message model
   */
  async findOneAndUpdate (filter, data) {
    const message = await this.Messages.findOne(filter)

    if (!message) {
      return null
    }
    message.set(data)
    return message.save()
  }

  /**
   * Delete a message
   * @param {String} id model id
   * @returns delete stats
   */
  delete (id) {
    return this.Messages.deleteOne({ _id: id })
  }

  /**
   * Creates a csv string of data
   * @param {string} language en, it
   * @returns csv data
   */
  async exportCSV (language) {
    const messages = await this.Messages.find({
      'messages.en': {
        $exists: true
      }
    })
    const exportData = []

    messages.forEach(item => {
      exportData.push({
        key: item.key,
        title: item.title,
        section: item.section,
        type: item.type,
        notes: item.notes,
        'en-referral': item.messages.en,
        [`${language}-actual`]: item.messages[language],
        [`${language}-new`]: null
      })
    })
    const csv = parse(exportData)

    return csv
  }

  /**
   * Imports a csv string exported with export method
   * @param {string} csv
   * @returns imported data
   */
  async importCSV (data) {
    const csvData = Buffer.from(data, 'base64').toString()
    const csvJson = await csvtojson().fromString(csvData)
    const headers = _.keys(_.first(csvJson))
    const language = headers && headers[6] ? _.first(headers[6].split('-')) : null

    if (!language) {
      return null
    }
    const promises = []

    csvJson.forEach(item => {
      const enValue = item['en-referral']
      const translatedValue = item[`${language}-new`]

      if (translatedValue) {
        const entry = this.Messages.findOne({ key: item.key })
          .then(message => {
            if (!message) {
              return this.create({
                key: item.key,
                title: item.title,
                section: item.section,
                type: item.type,
                notes: item.notes,
                messages: {
                  en: enValue,
                  [language]: translatedValue
                }
              })
            }
            message.set({
              [`messages.${language}`]: translatedValue
            })
            return message.save()
          })

        promises.push(entry)
      }
    })
    return Promise.all(promises)
  }
}

module.exports = MessagesController
