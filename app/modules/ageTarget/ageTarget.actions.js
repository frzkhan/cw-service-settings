const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class AgeTargetActions
 * @classdesc Actions AgeTarget
 */
class AgeTargetActions {
  async getCountry (data, reply) {
    const areas = await ctr.ageTarget.find(data.countryId)

    return reply.cwSendSuccess({
      data: {
        areas
      }
    })
  }

  async updateCountry (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const ageTarget = await ctr.ageTarget.findOneAndUpdate({ _id: data._id }, data)

    if (!ageTarget) {
      return reply.cwSendFail({
        message: 'Age Target not found',
        _message: '_errors.not_found'
      })
    }

    reply.cwSendSuccess({
      data: {
        ageTarget
      },
      message: 'Age Target has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }
}

module.exports = AgeTargetActions
