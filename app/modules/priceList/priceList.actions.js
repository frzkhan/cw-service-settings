const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class PriceListActions
 * @classdesc Actions PriceList
 */
class PriceListActions {
  async getPriceList (data, reply) {
    const areas = await ctr.priceList.find(data.countryId)

    reply.cwSendSuccess({
      data: {
        areas
      }
    })
  }

  async createPriceList (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const priceList = await ctr.priceList.create(data)

    reply.cwSendSuccess({
      data: {
        priceList
      },
      message: 'Price List has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async updatePriceList (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const priceList = await ctr.priceList.findOneAndUpdate({ _id: data._id }, data)

    if (!priceList) {
      return reply.cwSendFail({
        message: 'Price List not found',
        _message: '_errors.not_found'
      })
    }

    reply.cwSendSuccess({
      data: {
        priceList
      },
      message: 'Price List has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async activatePriceList (data, reply) {
    const priceList = await ctr.priceList.activate(data._id)

    if (!priceList) {
      return reply.cwSendFail({
        message: 'Price List not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwSendSuccess({
      data: {
        priceList
      },
      message: 'Price List has been activated successfully.',
      _message: '_responses.activated_successfully'
    })
  }

  async removePriceList (data, reply) {
    const priceList = await ctr.priceList.findOne({ _id: data._id })

    if (!priceList) {
      return reply.cwSendFail({
        message: 'Price List not found',
        _message: '_errors.not_found'
      })
    }
    if (priceList.status !== 'draft') {
      return reply.cwSendFail({
        message: 'Price List can not be deleted',
        _message: '_errors.delete_failed'
      })
    }
    await ctr.priceList.delete(data._id)

    reply.cwSendSuccess({
      message: 'Price List has been deleted successfully.',
      _message: '_responses.deleted_successfully'
    })
  }
}

module.exports = PriceListActions
