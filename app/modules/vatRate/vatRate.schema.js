const getVatRates = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['VatRate'],
    summary: 'List all VatRates',
    body: {
      type: 'object',
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
const createVatRate = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['VatRate'],
    summary: 'Create a new VatRate',
    body: {
      type: 'object',
      required: ['countryId', 'vat'],
      properties: {
        countryId: {
          type: 'string',
          typeof: 'ObjectId'
        },
        vat: {
          type: 'number',
          minLength: 1
        },
        shortDescription: {
          type: 'string'
        },
        longDescription: {
          type: 'string'
        },
        isDefault: {
          type: 'boolean'
        }
      }
    }
  }
}
const updateVatRate = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['VatRate'],
    summary: 'Create a new VatRate',
    body: {
      type: 'object',
      required: ['_id', 'countryId', 'vat'],
      properties: {
        _id: {
          type: 'string',
          description: 'VatRate id',
          typeof: 'ObjectId'
        },
        countryId: {
          type: 'string',
          typeof: 'ObjectId'
        },
        vat: {
          type: 'number',
          minLength: 1
        },
        shortDescription: {
          type: 'string'
        },
        longDescription: {
          type: 'string'
        },
        isDefault: {
          type: 'boolean'
        }
      }
    }
  }
}
const removeVatRate = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['VatRate'],
    summary: 'Delete a VatRate by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          type: 'string',
          description: 'VatRate id',
          typeof: 'ObjectId'
        }
      }
    }
  }
}
module.exports = {
  getVatRates,
  createVatRate,
  updateVatRate,
  removeVatRate
}
