const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/countries/priceList/accepted', (msg) => {
  const id = msg.data.id

  return ctr.priceList.incrementAccepted(id)
})

rabbitmq.consume('/settings/countries/priceList/get', ({ data }) => {
  return ctr.priceList.find(data.countryId)
})
