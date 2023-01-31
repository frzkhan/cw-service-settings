const { ctr } = require('@cowellness/cw-micro-service')()
const routeSchema = require('./i18n.schema')

module.exports = async function (fastify, opts, done) {
  fastify.get('/:language', routeSchema.getByLanguage, async function (request, reply) {
    const language = request.params.language
    const query = request.query.filter
    const data = await ctr.i18n.findByLang(language, query)

    if (!data) {
      return reply.cwsendFail({
        message: 'Language not found',
        _message: '_errors.not_found'
      })
    }
    reply.cwsendSuccess({
      data: {
        language: data
      }
    })
  })
  done()
}
