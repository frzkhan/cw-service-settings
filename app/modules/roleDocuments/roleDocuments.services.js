const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/countries/roleDocuments/accepted', (msg) => {
  const id = msg.data.id

  return ctr.roleDocuments.incrementAccepted(id)
})

rabbitmq.consume('/settings/countries/activeDocuments', (msg) => {
  return ctr.roleDocuments.getActiveDocumentList(msg.data.countryCode)
})

rabbitmq.consume('/settings/contract/byId/', (msg) => {
  return ctr.roleDocuments.getDocumentById(msg.data.documentId)
})
