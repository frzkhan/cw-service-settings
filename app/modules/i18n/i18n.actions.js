const { ctr, _ } = require('@cowellness/cw-micro-service')()

/**
 * @class I18nActions
 * @classdesc Actions I18n
 */
class I18nActions {
  async getLanguages (data, reply) {
    const languages = await ctr.i18n.find()

    reply.cwSendSuccess({
      data: {
        languages
      }
    })
  }

  async getLanguage (data, reply) {
    const language = await ctr.i18n.findByLang(data.language, data.filter)

    if (!language) {
      return reply.cwSendFail({
        message: 'Language not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwSendSuccess({
      data: {
        language
      }
    })
  }

  async getLanguageCache (data, reply) {
    const language = await ctr.i18n.findByLang(data.language)

    if (!language) {
      return reply.cwSendFail({
        message: 'Language not found',
        _message: '_errors.not_found'
      })
    }
    if (_.get(language, 'md5') === data.md5) {
      return reply.cwSendSuccess({
        data: {
          cached: true
        }
      })
    }
    reply.cwSendSuccess({
      data: {
        cached: false
      }
    })
  }
}

module.exports = I18nActions
