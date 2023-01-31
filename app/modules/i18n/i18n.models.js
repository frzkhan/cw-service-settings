const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const i18n = new Schema(
  {
    active: {
      type: Boolean,
      required: true,
      default: false,
      index: true
    },
    label: {
      type: String
    },
    key: {
      type: String
    },
    language: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
)

module.exports = mongodb.data.model('I18n', i18n)
