const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const countries = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    currency: {
      name: String,
      code: String,
      symbol: String
    }
  },
  { timestamps: true }
)

module.exports = mongodb.data.model('Countries', countries)
