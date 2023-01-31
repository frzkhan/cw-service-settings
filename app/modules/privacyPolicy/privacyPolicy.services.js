const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/countries/privacyPolicy/accepted', (msg) => {
  const id = msg.data.id

  return ctr.privacyPolicy.incrementAccepted(id)
})
