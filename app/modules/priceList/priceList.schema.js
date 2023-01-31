const constants = require('./priceList.constants')
const getPriceList = {
  schema: {
    security: [
      {
        authorization: []
      }
    ],
    tags: ['PriceList'],
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

const createPriceList = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['PriceList'],
    summary: 'Create a new PriceList',
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
        description: {
          type: 'string'
        },
        oneOff: {
          type: 'number'
        },
        forYear: {
          type: 'number'
        }
      }
    }
  }
}

const updatePriceList = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['PriceList'],
    summary: 'Update a PriceList by id',
    body: {
      type: 'object',
      required: ['_id', 'countryId', 'area'],
      properties: {
        _id: {
          typeof: 'ObjectId',
          description: 'PriceList id'
        },
        countryId: {
          type: 'string',
          typeof: 'ObjectId'
        },
        area: {
          type: 'string',
          enum: Object.keys(constants.areas)
        },
        description: {
          type: 'string'
        },
        oneOff: {
          type: 'number'
        },
        forYear: {
          type: 'number'
        }
      }
    }
  }
}

const activatePriceList = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['PriceList'],
    summary: 'Activate a PriceList by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          typeof: 'ObjectId',
          description: 'PriceList id'
        }
      }
    }
  }
}

const removePriceList = {
  schema: {
    security: [
      {
        authorization: ['settings.countries']
      }
    ],
    tags: ['PriceList'],
    summary: 'Delete a PriceList by id',
    body: {
      type: 'object',
      required: ['_id'],
      properties: {
        _id: {
          typeof: 'ObjectId',
          description: 'PriceList id'
        }
      }
    }
  }
}

module.exports = {
  getPriceList,
  createPriceList,
  updatePriceList,
  activatePriceList,
  removePriceList
}
