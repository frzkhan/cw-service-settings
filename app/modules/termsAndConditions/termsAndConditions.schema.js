const constants = require('./termsAndConditions.constants')
const getTermsAndConditions = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['TermsAndConditions'],
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
const createTermsAndConditions = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['TermsAndConditions'],
    summary: 'Create a new TermsAndConditions',
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
const updateTermsAndConditions = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['TermsAndConditions'],
    summary: 'Create a new TermsAndConditions',
    body: {
      type: 'object',
      required: ['_id', 'countryId', 'area'],
      properties: {
        _id: {
          typeof: 'ObjectId',
          description: 'TermsAndConditions id'
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
const activateTermsAndConditions = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['TermsAndConditions'],
    summary: 'Activate a TermsAndCondition by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          typeof: 'ObjectId',
          description: 'TermsAndCondition id'
        }
      }
    }
  }
}
const removeTermsAndConditions = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['TermsAndConditions'],
    summary: 'Delete a TermsAndConditions by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          typeof: 'ObjectId',
          description: 'TermsAndConditions id'
        }
      }
    }
  }
}
module.exports = {
  getTermsAndConditions,
  createTermsAndConditions,
  updateTermsAndConditions,
  activateTermsAndConditions,
  removeTermsAndConditions
}
