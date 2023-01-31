const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const termsOfPayment = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    day: {
      type: Number,
      required: true
    },
    isEom: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  { timestamps: true }
)
termsOfPayment.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      message: 'Name should be unique',
      _message: '_errors.termsOfPayment.name_unique'
    })
  } else {
    next(error)
  }
})

module.exports = mongodb.data.model('TermsOfPayment', termsOfPayment)
