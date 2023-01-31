const { mongodb, dayjs, redisJson, ctr } = require('@cowellness/cw-micro-service')()
/**
 * @class CountriesController
 * @classdesc Controller Countries
 */
class CountriesController {
  constructor () {
    this.Countries = mongodb.data.model('Countries')
  }

  /**
   * Retrives all Countries including stats
   */
  async find () {
    const countries = await this.Countries.find().lean()
    const countriesStats = countries.map(country => {
      const year = dayjs().format('YYYY')
      const month = dayjs().format('MM')

      return this.cacheStats(`${country._id}:${year}:${month}`)
        .then(stats => {
          country.stats = stats
          return country
        })
    })

    return Promise.all(countriesStats)
  }

  getByCode (code) {
    return this.Countries.findOne({
      code
    })
  }

  /**
   * Retrieves all countries
   */
  async getAll () {
    return this.Countries.find()
  }

  findOne (filter) {
    return this.Countries.findOne(filter)
  }

  async generateStats (year, month) {
    if (!year || !month) {
      const date = dayjs().subtract(1, 'month')
      year = date.format('YYYY')
      month = date.format('MM')
    }

    const countries = await this.Countries.find()

    countries.forEach(country => {
      const countryId = country._id
      // TODO: generate stats
      const data = {
        gym: 0,
        gymSuspended: 0,
        person: 0,
        personSupended: 0
      }
      this.cacheStats(`${countryId}:${year}:${month}`, data)
    })
  }

  async cacheStats (name, value) {
    const key = `countries:stats:${name}`

    if (!value) {
      return redisJson.get(key)
    }
    return redisJson.set(key, value)
  }

  /**
   * Gets active documents
   * @param {string} code country code
   * @returns active, cw area: privacyPolicy and TermsAndCondition documents
   */
  async publicDocs (code) {
    let country = await this.Countries.findOne({ code })

    if (!country) {
      country = await this.Countries.findOne({ code: 'uk' })
    }
    const area = 'cw'
    const status = 'active'
    const privacyPolicy = await ctr.privacyPolicy.findOne({ countryId: country._id, area, status })
    const termsAndConditions = await ctr.termsAndConditions.findOne({ countryId: country._id, area, status })

    return {
      privacyPolicy,
      termsAndConditions
    }
  }
}

module.exports = CountriesController
