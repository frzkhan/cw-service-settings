const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/sportInterest/get', () => {
  return ctr.sportInterest.find()
})
