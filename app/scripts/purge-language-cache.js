process.env.NODE_ENV = 'production'
const config = require('config')
config.fastify.port = 0
const cw = require('@cowellness/cw-micro-service')(config)

cw.autoStart().then(async () => {
  const languages = await cw.ctr.i18n.find()
  await Promise.all(languages.map(lang => cw.redisJson.del(`i18n_json_${lang.key}`)))
  console.log('done')
  process.exit()
})
