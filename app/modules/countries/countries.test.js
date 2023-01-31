const config = require('config')
const cw = require('@cowellness/cw-micro-service')(config)
const faker = require('faker')

beforeAll(async () => {
  await cw.autoStart()
  await cw.redis.flushdb()
  await cw.mongodb.data.model('Countries').deleteMany()
})

afterAll(async () => {
  return cw.stopAll()
})

describe('Test Countries', () => {
  it('should list all countries', async () => {
    await cw.mongodb.data.model('Countries').create({
      name: faker.address.country(),
      code: faker.address.countryCode()
    })
    const res = await cw.fastify.inject({
      method: 'GET',
      url: '/api/settings/countries'
    })
    const responseData = res.json()
    expect(responseData.success).toBe(true)
  })
})
