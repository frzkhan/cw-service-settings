const constants = require('./roleDocuments.constants')
const getRoleDocuments = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['RoleDocuments'],
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

const createRoleDocument = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['RoleDocuments'],
    summary: 'Create a new RoleDocuments',
    body: {
      type: 'object',
      required: ['countryId', 'area'],
      properties: {
        countryId: {
          type: 'string',
          typeof: 'ObjectId'
        },
        area: {
          type: 'string',
          enum: Object.keys(constants.areas)
        },
        content: {
          type: 'string'
        },
        intro: {
          type: 'string'
        }
      }
    }
  }
}

const updateRoleDocument = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['RoleDocuments'],
    summary: 'Update a RoleDocuments by id',
    body: {
      type: 'object',
      required: ['_id', 'countryId', 'area'],
      properties: {
        _id: {
          typeof: 'ObjectId',
          description: 'RoleDocuments id'
        },
        countryId: {
          type: 'string',
          typeof: 'ObjectId'
        },
        area: {
          type: 'string',
          enum: Object.keys(constants.areas)
        },
        content: {
          type: 'string'
        },
        intro: {
          type: 'string'
        }
      }
    }
  }
}

const activateRoleDocuments = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['RoleDocuments'],
    summary: 'Activate a RoleDocument by id',
    body: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          typeof: 'ObjectId',
          description: 'RoleDocument id'
        }
      }
    }
  }
}

const removeRoleDocument = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['RoleDocuments'],
    summary: 'Delete a RoleDocuments by id',
    body: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
          typeof: 'ObjectId',
          description: 'RoleDocuments id'
        }
      }
    }
  }
}

module.exports = {
  getRoleDocuments,
  createRoleDocument,
  updateRoleDocument,
  activateRoleDocuments,
  removeRoleDocument
}
