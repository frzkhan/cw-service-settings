const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const vatRate = new Schema(
  {
    countryId: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
      required: true
    },
    vat: {
      type: Number,
      required: true
    },
    shortDescription: {
      type: String
    },
    longDescription: {
      type: String
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

module.exports = mongodb.data.model('VatRate', vatRate)
