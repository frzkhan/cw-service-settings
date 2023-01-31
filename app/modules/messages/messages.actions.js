const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class MessagesActions
 * @classdesc Actions Messages
 */
class MessagesActions {
  async getMessages (data, reply) {
    const messages = await ctr.messages.find()

    reply.cwSendSuccess({
      data: {
        messages
      }
    })
  }

  async createMessage (data, reply) {
    const message = await ctr.messages.create(data)

    reply.cwSendSuccess({
      data: {
        message
      },
      message: 'Message has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async updateMessage (data, reply) {
    const message = await ctr.messages.findOneAndUpdate({ _id: data._id }, data)

    if (!message) {
      return reply.cwSendFail({
        message: 'Message with id not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwSendSuccess({
      data: {
        message
      },
      message: 'Message has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async removeMessage (data, reply) {
    await ctr.messages.delete(data._id)

    reply.cwSendSuccess({
      message: 'Message has been deleted successfully.',
      _message: '_responses.deleted_successfully'
    })
  }

  async exportTranslations (data, reply) {
    const csv = await ctr.messages.exportCSV(data.language)

    reply.cwSendSuccess({
      data: {
        content: csv
      }
    })
  }

  async importTranslations (data, reply) {
    const imported = await ctr.messages.importCSV(data.content)
    if (!imported) {
      return reply.cwSendFail({
        message: 'Invalid import csv format',
        _message: '_errors.csv.invalid_import_format'
      })
    }
    reply.cwSendSuccess({
      message: 'Imported successfully.',
      _message: '_responses.saved_successfully'
    })
  }
}

module.exports = MessagesActions
