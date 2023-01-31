const { ctr, rabbitmq, redisJson } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/settings/background/stats', async () => {
  const stats = await ctr.background.getStats()

  await redisJson.set('background_stats', stats)
  return stats
})

rabbitmq.consume('/settings/background/get', async (msg) => {
  const profileId = msg.data.profileId
  const redisKey = `profile:${profileId}`
  const defaultValue = { default: true }
  const value = await redisJson.get(redisKey)

  if (value) {
    return value
  }
  await redisJson.set(redisKey, defaultValue)
  return defaultValue
})

rabbitmq.consume('/settings/background/public/list', async (msg) => {
  const profileId = msg.data.profileId
  const backgrounds = await ctr.background.find({
    $or: [
      {
        profileIds: []
      },
      {
        profileIds: profileId
      }
    ]
  })
  const backgroundPaths = backgrounds.map(bg => ctr.background.setAbsolutePath(bg, msg.data.hostname))
  return backgroundPaths
})

rabbitmq.consume('/settings/background/urlById', async (msg) => {
  const backgrounds = await ctr.background.getById(msg.data.id)
  let backgroundPaths
  if (backgrounds) {
    backgroundPaths = ctr.background.setAbsolutePath(backgrounds, msg.data.hostname)
  }
  return backgroundPaths
})

rabbitmq.consume('/settings/background/set', async (msg) => {
  const profileId = msg.data.profileId
  const backgroundId = msg.data.backgroundId
  const redisKey = `profile:${profileId}`
  const defaultValue = { default: true }

  if (backgroundId) {
    const background = await ctr.background.findOne({ _id: backgroundId })

    if (background) {
      const redisData = {
        _id: background._id,
        name: background.name,
        files: background.files
      }
      await redisJson.set(redisKey, redisData)
      return redisData
    }
  }
  await redisJson.set(redisKey, defaultValue)
  return defaultValue
})

// schedule cron
rabbitmq.send('/cron/append', {
  name: 'settings:background:stats',
  type: 'cron',
  update: true,
  crontab: '0 2 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/settings/background/stats',
    msg: ''
  }]
})
