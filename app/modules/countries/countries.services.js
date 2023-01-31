const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/countries/stats', (msg) => {
  const data = msg.data
  const year = data.year
  const month = data.month

  return ctr.countries.generateStats(year, month)
})
rabbitmq.consume('/settings/countries/get', () => {
  return ctr.countries.getAll()
})
/**
 * schedule cron
 */
rabbitmq.send('/cron/append', {
  name: 'settings:countries:stats',
  type: 'cron',
  update: true,
  crontab: '0 2 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/settings/countries/stats',
    msg: {}
  }]
})
