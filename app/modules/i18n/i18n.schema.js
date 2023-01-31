const getByLanguage = {
  schema: {
    tags: ['I18n'],
    summary: 'Fetch a Language',
    params: {
      type: 'object',
      properties: {
        language: {
          type: 'string',
          description: 'Language code, e.g: en, it',
          minLength: 2
        }
      }
    },
    query: {
      type: 'object',
      properties: {
        filter: {
          type: 'string',
          description: 'Translation key starting with'
        }
      }
    }
  }
}

const getLanguages = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['I18n'],
    summary: 'List all Languages',
    body: {
      type: 'object'
    }
  }
}
const getLanguage = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['I18n'],
    summary: 'Fetch a Language',
    body: {
      type: 'object',
      required: ['language'],
      properties: {
        language: {
          type: 'string',
          description: 'Language code, e.g: en, it',
          minLength: 2
        },
        filter: {
          type: 'string',
          description: 'filter string'
        }
      }
    }
  }
}
const getLanguageCache = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['I18n'],
    summary: 'Fetch a Language cache',
    body: {
      type: 'object',
      required: ['language', 'md5'],
      properties: {
        language: {
          type: 'string',
          description: 'Language code, e.g: en, it',
          minLength: 2
        },
        md5: {
          type: 'string',
          description: 'md5 hash string'
        }
      }
    }
  }
}
module.exports = {
  getByLanguage,
  getLanguages,
  getLanguage,
  getLanguageCache
}
