const { ctr, rabbitmq, redisJson } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/i18n/generateJSON', (msg) => {
  const language = msg.data

  return ctr.i18n.generateJSON(language)
})
rabbitmq.consume('/settings/i18n/purge', async ({ data }) => {
  await redisJson.del(`i18n_json_${data}`)

  return true
})
