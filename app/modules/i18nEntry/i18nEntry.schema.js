const i18nEntryQueue = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['I18nEntry'],
    summary: 'i18n Queue',
    body: {
      type: 'object',
      properties: {
        key: {
          type: 'string'
        }
      }
    }
  }
}

const getTranslations = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['I18nEntry'],
    summary: 'List all Translations',
    body: {
      type: 'object'
    }
  }
}

const createTranslation = {
  schema: {
    security: [
      {
        authorization: ['settings.languages']
      }
    ],
    tags: ['I18nEntry'],
    summary: 'Create a Translation (dev only)',
    body: {
      type: 'object',
      required: ['key', 'translations'],
      properties: {
        key: {
          type: 'string',
          minLength: 1
        },
        translations: {
          type: 'object',
          required: ['en']
        }
      }
    }
  }
}

const updateTranslation = {
  schema: {
    security: [
      {
        authorization: ['settings.languages']
      }
    ],
    tags: ['I18nEntry'],
    summary: 'Update a Translation',
    body: {
      type: 'object',
      required: ['_id', 'key', 'translations'],
      properties: {
        _id: {
          type: 'string'
        },
        key: {
          type: 'string',
          minLength: 1
        },
        translations: {
          type: 'object',
          required: ['en']
        }
      }
    }
  }
}

const exportTranslations = {
  schema: {
    security: [
      {
        authorization: ['settings.languages']
      }
    ],
    tags: ['I18nEntry'],
    summary: 'Export Translation',
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
        authorization: ['settings.languages']
      }
    ],
    tags: ['I18nEntry'],
    summary: 'Import Translation',
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
  getTranslations,
  createTranslation,
  updateTranslation,
  exportTranslations,
  importTranslations,

  i18nEntryQueue
}
