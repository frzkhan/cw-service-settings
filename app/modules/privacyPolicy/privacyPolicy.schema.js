const constants = require('./privacyPolicy.constants')
const getPrivacyPolicy = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['PrivacyPolicy'],
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
const createPrivacyPolicy = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['PrivacyPolicy'],
    summary: 'Create a new PrivacyPolicy',
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
        preApproval: {
          type: 'boolean',
          default: false,
          description: 'If previous accepted document needs to accept document'
        }
      }
    }
  }
}
const updatePrivacyPolicy = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['PrivacyPolicy'],
    summary: 'Update a PrivacyPolicy by id',
    body: {
      type: 'object',
      required: ['_id', 'countryId', 'area'],
      properties: {
        _id: {
          typeof: 'ObjectId',
          description: 'PrivacyPolicy id'
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
        preApproval: {
          type: 'boolean',
          default: false,
          description: 'If previous accepted document needs to accept document'
        }
      }
    }
  }
}
const activatePrivacyPolicy = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['PrivacyPolicy'],
    summary: 'Activate a PrivacyPolicy by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          typeof: 'ObjectId',
          description: 'PrivacyPolicy id'
        }
      }
    }
  }
}
const removePrivacyPolicy = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['PrivacyPolicy'],
    summary: 'Delete a PrivacyPolicy by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          typeof: 'ObjectId',
          description: 'PrivacyPolicy id'
        }
      }
    }
  }
}
module.exports = {
  getPrivacyPolicy,
  createPrivacyPolicy,
  updatePrivacyPolicy,
  activatePrivacyPolicy,
  removePrivacyPolicy
}
