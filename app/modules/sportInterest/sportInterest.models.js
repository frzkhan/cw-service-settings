const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const sportInterest = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'SportInterest'
    },
    coniId: {
      type: String
    }
  },
  { timestamps: true }
)
sportInterest.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next({
      message: 'Name should be unique',
      _message: '_errors.sportInterests.name_unique'
    })
  } else {
    next(error)
  }
})

module.exports = mongodb.data.model('SportInterest', sportInterest)
