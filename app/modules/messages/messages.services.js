const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/messages/get', async (msg) => {
  const data = msg.data

  if (!data.key) {
    return {
      error: 'key_required'
    }
  }
  if (!data.type) {
    return {
      error: 'type_required'
    }
  }

  return ctr.messages.getMessage(data)
})
