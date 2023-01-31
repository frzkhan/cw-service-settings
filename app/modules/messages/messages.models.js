const { db } = require('@cowellness/cw-micro-service')()
const constants = require('./messages.constants')

const Schema = db.data.Schema

const messages = new Schema(
  {
    key: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: constants.TYPES
    },
    notes: {
      type: String
    },
    messages: {
      type: Object
    }
  },
  { timestamps: true }
)
messages.index({ key: 1, type: 1 }, { unique: true })
messages.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      message: 'Key + type should be unique',
      _message: '_errors.messages.key_unique'
    })
  } else {
    next(error)
  }
})

module.exports = db.data.model('Messages', messages)
