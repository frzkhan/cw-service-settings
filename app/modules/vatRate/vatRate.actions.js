const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class VatRateActions
 * @classdesc Actions VatRate
 */
class VatRateActions {
  async getVatRates (data, reply) {
    const vatRates = await ctr.vatRate.find(data.countryId)

    reply.cwSendSuccess({
      data: {
        vatRates
      }
    })
  }

  async createVatRate (data, reply) {
    try {
      const vatRate = await ctr.vatRate.create(data)

      reply.cwSendSuccess({
        message: 'Vat Rate has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          vatRate
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async updateVatRate (data, reply) {
    try {
      const updated = await ctr.vatRate.findOneAndUpdate({ _id: data._id }, data)

      if (!updated) {
        return reply.cwSendFail({
          message: 'Vat Rate not found',
          _message: '_errors.not_found'
        })
      }
      reply.cwSendSuccess({
        message: 'Vat Rate has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          vatRate: updated
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async removeVatRate (data, reply) {
    try {
      await ctr.vatRate.delete(data._id)

      return reply.cwSendSuccess({
        message: 'Vat Rate has been deleted successfully.',
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

module.exports = VatRateActions
