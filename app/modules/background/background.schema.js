const getBackgrounds = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Background'],
    summary: 'List all Background',
    body: {
      type: 'object'
    }
  }
}
const getBackground = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Background'],
    summary: 'Get a Background by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          description: 'Background id',
          typeof: 'ObjectId'
        }
      }
    }
  }
}
const createBackground = {
  schema: {
    security: [
      {
        authorization: ['settings.background']
      }
    ],
    tags: ['Background'],
    summary: 'Create a new Background',
    body: {
      type: 'object',
      required: ['name', 'files'],
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        files: {
          type: 'object',
          patternProperties: {
            '^([a-zA-Z]*)$': {
              type: 'object',
              anyOf: [{
                required: ['filename', '_id'],
                properties: {
                  _id: {
                    type: 'string'
                  },
                  filename: {
                    type: 'string'
                  }
                }
              },
              {
                required: ['filename', 'base64'],
                properties: {
                  filename: {
                    type: 'string'
                  },
                  base64: {
                    type: 'string',
                    typeof: 'Base64'
                  }
                }
              }]
            }
          }
        },
        isDefault: {
          type: 'boolean'
        },
        sportIds: {
          type: 'array',
          items: { type: 'string' }
        },
        profileIds: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
}
const updateBackground = {
  schema: {
    security: [
      {
        authorization: ['settings.background']
      }
    ],
    tags: ['Background'],
    summary: 'Update Background',
    body: {
      type: 'object',
      required: ['_id', 'name', 'files'],
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        files: {
          type: 'object',
          patternProperties: {
            '^([a-zA-Z]*)$': {
              type: 'object',
              anyOf: [{
                required: ['filename', '_id'],
                properties: {
                  _id: {
                    type: 'string'
                  },
                  filename: {
                    type: 'string'
                  }
                }
              },
              {
                required: ['filename', 'base64'],
                properties: {
                  filename: {
                    type: 'string'
                  },
                  base64: {
                    type: 'string',
                    typeof: 'Base64'
                  }
                }
              }]
            }
          }
        },
        isDefault: {
          type: 'boolean'
        },
        sportIds: {
          type: 'array',
          items: { type: 'string' }
        },
        profileIds: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
}
const getProfileBackground = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['Background'],
    summary: 'Get a Background by profileId',
    body: {
      type: 'object',
      required: ['profileId', 'type'],
      properties: {
        profileId: {
          type: 'string',
          description: 'Profile id',
          typeof: 'ObjectId'
        },
        type: {
          type: 'string',
          description: 'type: e.g, landscape, portrait'
        }
      }
    }
  }
}
const removeBackground = {
  schema: {
    security: [
      {
        authorization: ['settings.background']
      }
    ],
    tags: ['Background'],
    summary: 'Remove a Background by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          description: 'Background id',
          typeof: 'ObjectId'
        }
      }
    }
  }
}

module.exports = {
  getBackgrounds,
  getBackground,
  createBackground,
  updateBackground,
  getProfileBackground,
  removeBackground
}
