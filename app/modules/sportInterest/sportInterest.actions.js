const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class SportInterestActions
 * @classdesc Actions SportInterest
 */
class SportInterestActions {
  async getSportInterests (data, reply) {
    const sportInterests = await ctr.sportInterest.find()

    reply.cwSendSuccess({
      data: {
        sportInterests
      }
    })
  }

  async createSportInterest (data, reply) {
    try {
      const sportInterest = await ctr.sportInterest.create(data)

      reply.cwSendSuccess({
        message: 'Sport interest has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          sportInterest: sportInterest
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async updateSportInterest (data, reply) {
    try {
      const updated = await ctr.sportInterest.findOneAndUpdate({ _id: data._id }, data)

      if (!updated) {
        return reply.cwSendFail({
          message: 'Sport interest not found',
          _message: '_errors.not_found'
        })
      }
      reply.cwSendSuccess({
        message: 'Sport interest has been saved successfully.',
        _message: '_responses.saved_successfully',
        data: {
          sportInterest: updated
        }
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async removeSportInterests (data, reply) {
    try {
      const deleted = await ctr.sportInterest.delete(data._id)

      if (!deleted) {
        return reply.cwSendFail({
          message: 'Sport interest could not be deleted because it has children.',
          _message: '_responses.sportinterest.delete_failed_category'
        })
      }
      return reply.cwSendSuccess({
        message: 'Sport interest has been deleted successfully.',
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

module.exports = SportInterestActions
