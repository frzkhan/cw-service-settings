const path = require('path')
const basepath = path.join(__dirname, '..', 'app')

module.exports = {
  service: 'settings',
  fastify: { active: true, port: 3014, prefix: '/api/settings', sessionSecret: 'cw-micro-service-fastify-session-secret' },
  rabbitmq: { active: true, server: 'localhost:15672', user: 'dev', password: 'dev123', size: 1024 * 1024 * 5 },
  redis: { active: true, server: 'localhost', port: 16379 },
  swagger: { active: true, exposeRoute: true },
  logger: { level: 'debug' },
  basepath,
  mongodb: {
    active: true,
    server: 'localhost',
    port: '',
    user: '',
    password: '',
    debug: true,
    databases: [
      {
        name: 'data',
        db: 'settings',
        options: {}
      }
    ]
  }
}
