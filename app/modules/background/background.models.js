const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const background = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    files: {
      type: Object,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    sportIds: [{
      type: Schema.ObjectId,
      ref: 'SportInterest'
    }],
    profileIds: [{
      type: Schema.ObjectId
    }]
  },
  { timestamps: true }
)

module.exports = mongodb.data.model('Background', background)
