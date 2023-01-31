const { mongodb } = require('@cowellness/cw-micro-service')()

const Schema = mongodb.data.Schema

const roleDocuments = new Schema(
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
    progressive: {
      type: Number,
      required: true
    },
    accepted: {
      type: Number,
      default: 0
    },
    content: {
      type: String
    },
    intro: {
      type: String
    },
    activatedAt: {
      type: Date,
      default: null
    },
    expiredAt: {
      type: Date,
      default: null
    },
    status: {
      type: String
    }
  },
  { timestamps: true }
)

roleDocuments.pre('save', function (next) {
  if (!this.activatedAt && !this.expiredAt) {
    this.status = 'draft'
  } else
  if (this.activatedAt && !this.expiredAt) {
    this.status = 'active'
  } else
  if (this.activatedAt && this.expiredAt) {
    this.status = 'expired'
  }
  next()
})

module.exports = mongodb.data.model('RoleDocuments', roleDocuments)
