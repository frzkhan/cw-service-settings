const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const ageTarget = new Schema(
  {
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
      required: true
    },
    area: {
      type: String,
      required: true
    },
    accepted: {
      type: Number,
      default: 0
    },
    age: {
      type: Number
    },
    activatedAt: {
      type: Date,
      default: null
    },
    expiredAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongodb.data.model('AgeTarget', ageTarget)
