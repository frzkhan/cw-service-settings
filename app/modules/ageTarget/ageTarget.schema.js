const getCountry = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['AgeTarget'],
    summary: 'List all grouped by areas',
    body: {
      type: 'object',
      required: ['countryId'],
      properties: {
        countryId: {
          type: 'string',
          typeof: 'ObjectId',
          description: 'Country id'
        }
      }
    }
  }
}
const updateCountry = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['AgeTarget'],
    summary: 'Update a AgeTarget',
    body: {
      type: 'object',
      required: ['countryId', '_id'],
      properties: {
        countryId: {
          type: 'string',
          typeof: 'ObjectId',
          description: 'Country id'
        },
        _id: {
          type: 'string',
          typeof: 'ObjectId',
          description: 'age target id'
        },
        area: {
          type: 'string',
          description: 'age target area'
        },
        age: {
          type: 'number',
          description: 'age value'
        }
      }
    }
  }
}
module.exports = {
  getCountry,
  updateCountry
}
