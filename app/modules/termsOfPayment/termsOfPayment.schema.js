const getTermsOfPayments = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['TermsOfPayment'],
    summary: 'List all TermsOfPayment',
    body: {
      type: 'object'
    }
  }
}
const getTermsOfPayment = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['TermsOfPayment'],
    summary: 'Get a new TermsOfPayment by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          description: 'TermsOfPayment id',
          typeof: 'ObjectId'
        }
      }
    }
  }
}
const createTermsOfPayment = {
  schema: {
    security: [
      {
        authorization: ['settings.termsOfPayment']
      }
    ],
    tags: ['TermsOfPayment'],
    summary: 'Create a new TermsOfPayment',
    body: {
      type: 'object',
      required: ['name', 'day', 'isEom', 'translations'],
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        day: {
          type: 'number',
          minimum: 0
        },
        isEom: {
          type: 'boolean'
        },
        translations: {
          type: 'object',
          properties: {
            it: {
              type: 'string'
            }
          }
        }
      }
    }
  }
}
const updateTermsOfPayment = {
  schema: {
    security: [
      {
        authorization: ['settings.termsOfPayment']
      }
    ],
    tags: ['TermsOfPayment'],
    summary: 'Create a new TermsOfPayment',
    body: {
      type: 'object',
      required: ['_id', 'name', 'day', 'isEom', 'translations'],
      properties: {
        _id: {
          type: 'string',
          description: 'TermsOfPayment id',
          typeof: 'ObjectId'
        },
        name: {
          type: 'string',
          minLength: 1
        },
        day: {
          type: 'number',
          minimum: 0
        },
        isEom: {
          type: 'boolean'
        },
        translations: {
          type: 'object',
          properties: {
            it: {
              type: 'string'
            }
          }
        }
      }
    }
  }
}
const removeTermsOfPayment = {
  schema: {
    security: [
      {
        authorization: ['settings.termsOfPayment']
      }
    ],
    tags: ['TermsOfPayment'],
    summary: 'Delete a TermsOfPayment by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          description: 'TermsOfPayment id',
          typeof: 'ObjectId'
        }
      }
    }
  }
}

module.exports = {
  getTermsOfPayments,
  getTermsOfPayment,
  createTermsOfPayment,
  updateTermsOfPayment,
  removeTermsOfPayment
}
