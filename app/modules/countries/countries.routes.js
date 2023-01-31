const { ctr } = require('@cowellness/cw-micro-service')()
const routeSchema = require('./countries.schema')

module.exports = async function (fastify, opts, done) {
  fastify.get('/', routeSchema.list, async function (request, reply) {
    const data = await ctr.countries.find()

    reply.cwsendSuccess({
      data: {
        countries: data
      }
    })
  })
  fastify.get('/public/docs/:code', routeSchema.docs, async function (request, reply) {
    const code = request.params.code
    const docs = await ctr.countries.publicDocs(code)

    if (!docs) {
      return reply.cwsendFail({
        message: 'Country not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwsendSuccess({
      data: {
        docs
      }
    })
  })
  done()
}
