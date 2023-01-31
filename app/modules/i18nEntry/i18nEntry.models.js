const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const i18nEntry = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    translations: {
      type: Object
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null
    }
  },
  { timestamps: true }
)
i18nEntry.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      message: 'Key should be unique',
      _message: '_errors.i18n.key_unique'
    })
  } else {
    next(error)
  }
})
module.exports = mongodb.data.model('I18nEntry', i18nEntry)
