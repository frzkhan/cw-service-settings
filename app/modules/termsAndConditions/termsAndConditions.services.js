const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/countries/termsAndConditions/accepted', (msg) => {
  const id = msg.data.id

  return ctr.termsAndConditions.incrementAccepted(id)
})
