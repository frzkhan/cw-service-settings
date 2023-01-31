const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class TermsAndConditionsActions
 * @classdesc Actions TermsAndConditions
 */
class TermsAndConditionsActions {
  async getTermsAndConditions (data, reply) {
    const areas = await ctr.termsAndConditions.find(data.countryId)

    reply.cwSendSuccess({
      data: {
        areas
      }
    })
  }

  async createTermsAndConditions (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const termsAndConditions = await ctr.termsAndConditions.create(data)

    reply.cwSendSuccess({
      data: {
        termsAndConditions
      },
      message: 'Terms And Conditions has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async updateTermsAndConditions (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const termsAndConditions = await ctr.termsAndConditions.findOneAndUpdate({ _id: data._id }, data)

    if (!termsAndConditions) {
      return reply.cwSendFail({
        message: 'Terms And Conditions not found',
        _message: '_errors.not_found'
      })
    }

    reply.cwSendSuccess({
      data: {
        termsAndConditions
      },
      message: 'Terms And Conditions has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async activateTermsAndConditions (data, reply) {
    const termsAndConditions = await ctr.termsAndConditions.activate(data._id)

    if (!termsAndConditions) {
      return reply.cwSendFail({
        message: 'Terms And Condition not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwSendSuccess({
      data: {
        termsAndConditions
      },
      message: 'Terms And Condition has been activated successfully.',
      _message: '_responses.activated_successfully'
    })
  }

  async removeTermsAndConditions (data, reply) {
    const termsAndConditions = await ctr.termsAndConditions.findOne({ _id: data._id })

    if (!termsAndConditions) {
      return reply.cwSendFail({
        message: 'Terms And Condition not found',
        _message: '_errors.not_found'
      })
    }
    if (termsAndConditions.status !== 'draft') {
      return reply.cwSendFail({
        message: 'Terms And Condition can not be deleted',
        _message: '_errors.delete_failed'
      })
    }
    await ctr.termsAndConditions.delete(data._id)

    reply.cwSendSuccess({
      message: 'Terms And Condition has been deleted successfully.',
      _message: '_responses.deleted_successfully'
    })
  }
}

module.exports = TermsAndConditionsActions
