const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class RoleDocumentsActions
 * @classdesc Actions RoleDocuments
 */
class RoleDocumentsActions {
  async getRoleDocuments (data, reply) {
    const areas = await ctr.roleDocuments.find(data.countryId)

    reply.cwSendSuccess({
      data: {
        areas
      }
    })
  }

  async createRoleDocument (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const roleDocuments = await ctr.roleDocuments.create(data)

    reply.cwSendSuccess({
      data: {
        roleDocuments
      },
      message: 'Role Documents has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async updateRoleDocument (data, reply) {
    const countryExists = await ctr.countries.findOne({ _id: data.countryId })

    if (!countryExists) {
      return reply.cwSendFail({
        message: 'Country id not found',
        _message: '_errors.not_found'
      })
    }
    const roleDocuments = await ctr.roleDocuments.findOneAndUpdate({ _id: data._id }, data)

    if (!roleDocuments) {
      return reply.cwSendFail({
        message: 'Role Documents not found',
        _message: '_errors.not_found'
      })
    }

    reply.cwSendSuccess({
      data: {
        roleDocuments
      },
      message: 'Role Documents has been saved successfully.',
      _message: '_responses.saved_successfully'
    })
  }

  async activateRoleDocuments (data, reply) {
    const roleDocuments = await ctr.roleDocuments.activate(data._id)

    if (!roleDocuments) {
      return reply.cwSendFail({
        message: 'Role Documents not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwSendSuccess({
      data: {
        roleDocuments
      },
      message: 'Role Documents has been activated successfully.',
      _message: '_responses.activated_successfully'
    })
  }

  async removeRoleDocument (data, reply) {
    const roleDocuments = await ctr.roleDocuments.findOne({ _id: data._id })

    if (!roleDocuments) {
      return reply.cwSendFail({
        message: 'Role Documents not found',
        _message: '_errors.not_found'
      })
    }
    if (roleDocuments.status !== 'draft') {
      return reply.cwSendFail({
        message: 'Role Documents can not be deleted',
        _message: '_errors.delete_failed'
      })
    }
    await ctr.roleDocuments.delete(data._id)

    reply.cwSendSuccess({
      message: 'Role Documents has been deleted successfully.',
      _message: '_responses.deleted_successfully'
    })
  }
}

module.exports = RoleDocumentsActions
