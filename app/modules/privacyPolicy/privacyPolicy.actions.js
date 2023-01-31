const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class PrivacyPolicyActions
 * @classdesc Actions PrivacyPolicy
 */
class PrivacyPolicyActions {
  async getPrivacyPolicy (data, reply) {
    const areas = await ctr.privacyPolicy.find(data.countryId)

    reply.cwSendSuccess({
      data: {
        areas
      }
    })
  }

  async createPrivacyPolicy (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const privacyPolicy = await ctr.privacyPolicy.create(data)

    reply.cwSendSuccess({
      data: {
        privacyPolicy
      },
      message: 'Privacy Policy has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async updatePrivacyPolicy (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const privacyPolicy = await ctr.privacyPolicy.findOneAndUpdate({ _id: data._id }, data)

    if (!privacyPolicy) {
      return reply.cwSendFail({
        message: 'Privacy Policy not found',
        _message: '_errors.not_found'
      })
    }

    reply.cwSendSuccess({
      data: {
        privacyPolicy
      },
      message: 'Privacy Policy has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async activatePrivacyPolicy (data, reply) {
    const privacyPolicy = await ctr.privacyPolicy.activate(data._id)

    if (!privacyPolicy) {
      return reply.cwSendFail({
        message: 'Privacy Policy not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwSendSuccess({
      data: {
        privacyPolicy
      },
      message: 'Privacy Policy has been activated successfully.',
      _message: '_responses.activated_successfully'
    })
  }

  async removePrivacyPolicy (data, reply) {
    const privacyPolicy = await ctr.privacyPolicy.findOne({ _id: data._id })

    if (!privacyPolicy) {
      return reply.cwSendFail({
        message: 'Privacy Policy not found',
        _message: '_errors.not_found'
      })
    }
    if (privacyPolicy.status !== 'draft') {
      return reply.cwSendFail({
        message: 'Privacy Policy can not be deleted',
        _message: '_errors.delete_failed'
      })
    }
    await ctr.privacyPolicy.delete(data._id)

    reply.cwSendSuccess({
      message: 'Privacy Policy has been deleted successfully.',
      _message: '_responses.deleted_successfully'
    })
  }
}

module.exports = PrivacyPolicyActions
