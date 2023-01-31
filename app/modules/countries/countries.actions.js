const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class CountriesActions
 * @classdesc Actions Countries
 */
class CountriesActions {
  async getCountries (data, reply) {
    const countries = await ctr.countries.find()

    reply.cwSendSuccess({
      data: {
        countries
      }
    })
  }

  async getDocs (data, reply) {
    const code = data.code
    const docs = await ctr.countries.publicDocs(code)

    if (!docs) {
      return reply.cwSendFail({
        message: 'Country not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwSendSuccess({
      data: {
        docs
      }
    })
  }
}

module.exports = CountriesActions
