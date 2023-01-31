const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()
const { i18nEntryQueue } = require('./i18nEntry.schema')
rabbitmq.consume('/settings/i18nEntry/create', (msg) => {
  const filter = msg.data
  return ctr.i18nEntry.create(filter)
}, { schema: i18nEntryQueue })

rabbitmq.consume('/settings/i18nEntry/update', (msg) => {
  const filter = msg.data
  return ctr.i18nEntry.findOneAndUpdate(filter)
}, { schema: i18nEntryQueue })

rabbitmq.consume('/settings/i18nEntry/delete', (msg) => {
  const filter = msg.data
  return ctr.i18nEntry.delete(filter)
}, { schema: i18nEntryQueue })

/**
 * Regex match for transalation key
 */
rabbitmq.consume('/settings/i18nEntry/get', (msg) => {
  return ctr.i18nEntry.find({ key: new RegExp(msg.data.key) })
}, { schema: i18nEntryQueue })
