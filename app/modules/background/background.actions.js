const { ctr, _, rabbitmq } = require('@cowellness/cw-micro-service')()

/**
 * @class BackgroundActions
 * @classdesc Actions Background
 */
class BackgroundActions {
  async getBackgrounds (data, reply) {
    const backgrounds = await ctr.background.find()
    const sportInterests = await ctr.background.getSportInterestFromBackgrounds(backgrounds)

    reply.cwSendSuccess({
      data: {
        backgrounds,
        sportInterests
      }
    })
  }

  async getBackground (data, reply) {
    let background = await ctr.background.findOne({ _id: data._id }).lean().exec()

    if (!background) {
      background = await ctr.background.findOne({ isDefault: true }).lean().exec()
    }
    if (background && background.profileIds && background.profileIds.length) {
      const resp = await rabbitmq.sendAndRead('/auth/company/profiles/detail', { profileIds: background.profileIds, fields: '_id displayName' })
      background.profileIds = resp.data
    }

    const sportInterests = await ctr.background.getSportInterestFromBackgrounds([background])

    reply.cwSendSuccess({
      data: {
        background,
        sportInterests
      }
    })
  }

  async createBackground (data, reply) {
    try {
      const background = await ctr.background.create(data)
      const sportInterests = await ctr.background.getSportInterestFromBackgrounds([background])

      reply.cwSendSuccess({
        data: {
          background,
          sportInterests
        },
        message: 'Background has been saved successfully.',
        _message: '_responses.saved_successfully'
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async updateBackground (data, reply) {
    try {
      const background = await ctr.background.findOneAndUpdate({ _id: data._id }, data)
      await rabbitmq.sendAndRead('/auth/profiles/setBackground', { backgroundId: data._id, ids: data.profileIds })
      if (!background) {
        return reply.cwSendFail({
          message: 'Background with id not found',
          _message: '_errors.not_found'
        })
      }

      const sportInterests = await ctr.background.getSportInterestFromBackgrounds([background])

      reply.cwSendSuccess({
        data: {
          background,
          sportInterests
        },
        message: 'Background has been saved successfully.',
        _message: '_responses.saved_successfully'
      })
    } catch (error) {
      reply.cwSendFail({
        message: error.message,
        _message: error._message ? error._message : null
      })
    }
  }

  async getProfileBackground (data, reply) {
    const profileId = data.profileId
    const type = data.type
    const background = await ctr.background.getProfileBackground(profileId, type)

    reply.cwSendSuccess({
      data: {
        background: _.get(background, `files.${type}`)
      }
    })
  }

  async removeBackground (data, reply) {
    const background = await ctr.background.findOne({ _id: data._id })

    if (!background) {
      return reply.cwSendFail({
        message: 'Background id not found',
        _message: '_responses.delete_failed'
      })
    }
    if (background.isDefault) {
      return reply.cwSendFail({
        message: 'Default Background can not be deleted',
        _message: '_responses.delete_failed'
      })
    }
    await ctr.background.delete(data._id)

    return reply.cwSendSuccess({
      message: 'Background has been deleted successfully.',
      _message: '_responses.deleted_successfully'
    })
  }
}

module.exports = BackgroundActions
