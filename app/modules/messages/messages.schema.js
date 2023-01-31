const constants = require('./messages.constants')
const getMessages = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Messages'],
    summary: 'List all Messages',
    body: {
      type: 'object'
    }
  }
}

const createMessage = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['Messages'],
    summary: 'Create a Message',
    body: {
      type: 'object',
      required: ['key', 'title', 'section', 'type'],
      properties: {
        key: {
          type: 'string',
          minLength: 1
        },
        title: {
          type: 'string',
          minLength: 1
        },
        section: {
          type: 'string',
          minLength: 1
        },
        type: {
          type: 'string',
          minLength: 1,
          enum: constants.TYPES
        },
        notes: {
          type: 'string'
        },
        messages: {
          type: 'object',
          properties: {
            en: {
              type: 'string'
            }
          }
        }
      }
    }
  }
}

const updateMessage = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['Messages'],
    summary: 'Update a Message',
    body: {
      type: 'object',
      required: ['_id', 'key', 'title', 'section', 'type'],
      properties: {
        _id: {
          type: 'string',
          description: 'Message id',
          typeof: 'ObjectId'
        },
        key: {
          type: 'string',
          minLength: 1
        },
        title: {
          type: 'string',
          minLength: 1
        },
        section: {
          type: 'string',
          minLength: 1
        },
        type: {
          type: 'string',
          minLength: 1,
          enum: constants.TYPES
        },
        notes: {
          type: 'string'
        },
        messages: {
          type: 'object',
          properties: {
            en: {
              type: 'string'
            }
          }
        }
      }
    }
  }
}

const removeMessage = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['Messages'],
    summary: 'Delete a Message',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          description: 'Message id',
          typeof: 'ObjectId'
        }
      }
    }
  }
}

const exportTranslations = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['Messages'],
    summary: 'Export Messages',
    body: {
      type: 'object',
      required: ['language'],
      properties: {
        language: {
          type: 'string',
          description: 'Language code, e.g: en, it',
          minLength: 2
        }
      }
    }
  }
}

const importTranslations = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['Messages'],
    summary: 'Import Messages',
    body: {
      type: 'object',
      required: ['content'],
      properties: {
        content: {
          type: 'string'
        }
      }
    }
  }
}

module.exports = {
  getMessages,
  createMessage,
  updateMessage,
  removeMessage,
  exportTranslations,
  importTranslations
}
