const { mongodb, rabbitmq, ctr, _ } = require('@cowellness/cw-micro-service')()
/**
 * @class BackgroundController
 * @classdesc Controller Background Settings
 */

class BackgroundController {
  constructor () {
    this.Background = mongodb.data.model('Background')
  }

  /**
   * fetch all backgrounds
   */
  find (filter) {
    return this.Background.find(filter)
  }

  /**
   * find one background by filter
   * @param {*} filter
   */
  findOne (filter) {
    return this.Background.findOne(filter)
  }

  /**
   * Send files to file-service to save
   * @param {*} files
   */
  async putFiles (files) {
    const fileUploads = Object.keys(files).filter(type => !files[type]._id).map(type => {
      const file = files[type]

      return rabbitmq.sendAndRead('/files/post', {
        filename: file.filename,
        binData: file.base64
      }).then(msg => {
        const data = msg.data

        data.type = type
        return data
      })
    })
    const filesData = await Promise.all(fileUploads)
    const filesObject = _.reduce(filesData, (result, item) => {
      const type = item.type
      delete item.type
      result[type] = item
      return result
    }, {})

    return filesObject
  }

  async setDefault (backgroundId) {
    await this.Background.updateMany({ isDefault: true }, { isDefault: false })
    return this.Background.updateOne({ _id: backgroundId }, { isDefault: true })
  }

  async getById (id) {
    return await this.Background.findById(id).lean().exec()
  }

  /**
   * create a background
   * @param {*} data
   */
  async create (data) {
    const files = await this.putFiles(data.files)
    const background = await this.Background.create({
      name: data.name,
      files,
      isDefault: data.isDefault,
      sportIds: data.sportIds,
      profileIds: data.profileIds
    })

    if (background.isDefault) {
      await this.setDefault(background._id)
    }
    return background
  }

  /**
   * Update model by filter
   * @param {*} filter model filter
   * @param {*} data model data
   */
  async findOneAndUpdate (filter, data) {
    const uploadedFiles = await this.putFiles(data.files)
    const background = await this.Background.findOne(filter)

    if (!background) {
      return null
    }
    const files = {}

    Object.keys(data.files).forEach(type => {
      const uploadedFile = uploadedFiles[type]
      const bgFile = background.files[type]

      if (uploadedFile) {
        files[type] = uploadedFile
      } else
      if (bgFile) {
        files[type] = bgFile
      }
    })

    background.set('name', data.name)
    if (!background.isDefault) {
      background.set('isDefault', data.isDefault)
    }
    background.set('sportIds', data.sportIds)
    background.set('profileIds', data.profileIds)
    background.set('files', files)
    if (background.isDefault) {
      await this.setDefault(background._id)
    }
    return background.save()
  }

  /**
   * generates a statistic of how many profiles use a background
   */
  async getStats () {
    const backgrounds = await this.Background.aggregate([
      { $match: { profileIds: { $exists: true, $not: { $size: 0 } } } },
      { $unwind: '$profileIds' },
      { $group: { _id: '$profileIds', count: { $sum: 1 } } },
      { $addFields: { updatedAt: new Date().toISOString() } }
    ])

    return _.reduce(backgrounds, (result, item) => {
      result[item._id] = {
        count: item.count,
        updatedAt: item.updatedAt
      }
      return result
    }, {})
  }

  /**
   * return url to file by profileId
   * @param {string} profileId
   * @param {string} type landscape/portrait
   */
  async getProfileBackground (profileId, type) {
    const background = await this.Background.findOne({
      profileIds: profileId,
      isDefault: true,
      [`files.${type}`]: {
        $exists: true
      }
    })
    return background
  }

  /**
   * sportInterest from backgrounds
   *
   * @param {Array} backgrounds
   * @returns {Array} array of sport interest
   */
  getSportInterestFromBackgrounds (backgrounds) {
    if (!_.isArray(backgrounds) || !backgrounds.length) {
      return []
    }
    const listIds = _.uniq(_.flatMap(backgrounds, bg => bg.sportIds)).map(_id => mongodb.data.Types.ObjectId(_id))
    return ctr.sportInterest.find({ _id: { $in: listIds } })
  }

  /**
   * add base path to background
   *
   * @param {Object} background
   * @param {String} hostname
   */
  setAbsolutePath (background, hostname) {
    if (!background) {
      return null
    }
    const domain = `https://${hostname}`
    const types = Object.keys(background.files)

    types.forEach(type => {
      const url = _.get(background.files, `${type}.url`)
      _.set(background.files, `${type}.url`, domain + url)
    })
    return background
  }

  async delete (id) {
    const background = await this.Background.findOne({ _id: id })
    if (!background) {
      return null
    }
    const files = background.files
    Object.keys(files).forEach(type => {
      if (files[type]._id) {
        rabbitmq.send('/files/delete', { _id: files[type]._id })
      }
    })
    return this.Background.deleteOne({ _id: id })
  }
}

module.exports = BackgroundController
