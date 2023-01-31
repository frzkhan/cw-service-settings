const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class TermsOfPaymentActions
 * @classdesc Actions TermsOfPayment
 */
class TermsOfPaymentActions {
  async getTermsOfPayments (data, reply) {
    const termsOfPayment = await ctr.termsOfPayment.find()

    reply.cwSendSuccess({
      data: {
        termsOfPayment
      }
    })
  }

  async getTermsOfPayment (data, reply) {
    const termOfPayment = await ctr.termsOfPayment.findOne({ _id: data._id })

    reply.cwSendSuccess({
      data: {
        termOfPayment
      }
    })
  }

  async createTermsOfPayment (data, reply) {
    try {
      const termOfPayment = await ctr.termsOfPayment.create(data)

      reply.cwSendSuccess({
        message: 'Terms of Payment has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          termOfPayment
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async updateTermsOfPayment (data, reply) {
    try {
      const updated = await ctr.termsOfPayment.findOneAndUpdate({ _id: data._id }, data)

      if (!updated) {
        return reply.cwSendFail({
          message: 'Terms of Payment not found',
          _message: '_errors.not_found'
        })
      }
      reply.cwSendSuccess({
        message: 'Terms of Payment has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          termOfPayment: updated
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async removeTermsOfPayment (data, reply) {
    try {
      await ctr.termsOfPayment.delete(data._id)

      return reply.cwSendSuccess({
        message: 'Terms of Payment has been deleted successfully.',
        _message: '_responses.deleted_successfully'
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }
}

module.exports = TermsOfPaymentActions
