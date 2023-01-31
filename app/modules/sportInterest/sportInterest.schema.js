const getSportInterests = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['SportInterest'],
    summary: 'List all Sport Interests',
    body: {
      type: 'object'
    }
  }
}
const createSportInterest = {
  schema: {
    security: [
      {
        authorization: ['settings.sportInterest']
      }
    ],
    tags: ['SportInterest'],
    summary: 'Create a new Sport Interest',
    body: {
      type: 'object',
      required: ['name', 'translations'],
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        translations: {
          type: 'object',
          properties: {
            it: {
              type: 'string'
            }
          }
        },
        parentId: {
          type: 'string',
          nullable: true
        }
      }
    }
  }
}
const updateSportInterest = {
  schema: {
    security: [
      {
        authorization: ['settings.sportInterest']
      }
    ],
    tags: ['SportInterest'],
    summary: 'Create a new Sport Interest',
    body: {
      type: 'object',
      required: ['_id', 'name', 'translations'],
      properties: {
        _id: {
          type: 'string',
          description: 'Sport interest id',
          typeof: 'ObjectId'
        },
        name: {
          type: 'string',
          minLength: 1
        },
        translations: {
          type: 'object',
          properties: {
            it: {
              type: 'string'
            }
          }
        },
        parentId: {
          type: 'string',
          nullable: true
        }
      }
    }
  }
}
const removeSportInterests = {
  schema: {
    security: [
      {
        authorization: ['settings.sportInterest']
      }
    ],
    tags: ['SportInterest'],
    summary: 'Delete a Sport Interest by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          description: 'Sport interest id',
          typeof: 'ObjectId'
        }
      }
    }
  }
}

module.exports = {
  getSportInterests,
  createSportInterest,
  updateSportInterest,
  removeSportInterests
}
