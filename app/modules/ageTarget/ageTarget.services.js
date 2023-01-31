const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/countries/ageTarget/accepted', (msg) => {
  const id = msg.data.id

  return ctr.ageTarget.incrementAccepted(id)
})

rabbitmq.consume('/settings/ageTarget/emancipation', ({ data }) => {
  return ctr.ageTarget.getEmancipationAge(data.countryCode)
})
