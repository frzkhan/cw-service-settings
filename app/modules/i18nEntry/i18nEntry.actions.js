const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class I18nEntryActions
 * @classdesc Actions I18nEntry
 */
class I18nEntryActions {
  async getTranslations (data, reply) {
    const translations = await ctr.i18nEntry.find()

    reply.cwSendSuccess({
      data: {
        translations
      }
    })
  }

  async createTranslation (data, reply) {
    const created = await ctr.i18nEntry.create(data)

    if (!created) {
      return reply.cwSendFail({
        message: 'Translation already exist',
        _message: '_errors.i18n.key_exists'
      })
    }

    reply.cwSendSuccess({
      message: 'Translation has been saved successfully.',
      _message: '_responses.saved_successfully',
      data: {
        translation: created
      }
    })
  }

  async updateTranslation (data, reply) {
    const updated = await ctr.i18nEntry.findOneAndUpdate({ _id: data._id }, data)

    if (!updated) {
      return reply.cwSendFail({
        message: 'Translation not found',
        _message: '_errors.not_found'
      })
    }

    reply.cwSendSuccess({
      message: 'Translation has been saved successfully.',
      _message: '_responses.saved_successfully',
      data: {
        translation: updated
      }
    })
  }

  async exportTranslations (data, reply) {
    const csv = await ctr.i18nEntry.exportCSV(data.language)

    reply.cwSendSuccess({
      data: {
        content: csv
      }
    })
  }

  async importTranslations (data, reply) {
    const imported = await ctr.i18nEntry.importCSV(data.content)
    if (!imported) {
      return reply.cwSendFail({
        message: 'Invalid import csv format',
        _message: '_errors.i18n.invalid_import_format'
      })
    }
    reply.cwSendSuccess({
      message: 'Imported successfully.',
      _message: '_responses.saved_successfully'
    })
  }
}

module.exports = I18nEntryActions
