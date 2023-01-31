const list = {
  schema: {
    tags: ['Countries'],
    summary: 'List all Countries with stats'
  }
}
const docs = {
  schema: {
    tags: ['Countries'],
    summary: 'Get Public docs by code',
    params: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'country code'
        }
      }
    }
  }
}

const getCountries = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Countries'],
    summary: 'List all Countries with stats',
    body: {
      type: 'object'
    }
  }
}

const getDocs = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Countries'],
    summary: 'Get Public docs by code',
    body: {
      type: 'object',
      required: ['code'],
      properties: {
        code: {
          type: 'string',
          description: 'country code'
        }
      }
    }
  }
}

module.exports = {
  list,
  docs,
  getCountries,
  getDocs
}
