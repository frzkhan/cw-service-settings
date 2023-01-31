process.env.NODE_ENV = 'production'
const config = require('config')
config.fastify.port = 0
const cw = require('@cowellness/cw-micro-service')(config)
const path = require('path')
const csvtojson = require('csvtojson')
const csvPath = path.join(__dirname, '../data/sports-interest.csv')

async function findOrCreate (item) {
  const sportInterest = cw.ctr.sportInterest
  let parent = await sportInterest.findOne({
    name: item.enParent
  })

  if (!parent) {
    parent = await createParent(item)
  }
  let child = null
  console.log(item)
  if (item.enChild) {
    child = await sportInterest.findOne({
      name: item.enChild
    })
    if (!child) {
      await createChild({
        ...item,
        parentId: parent._id
      })
    }
  }
}
async function createParent (item) {
  const sportInterest = cw.ctr.sportInterest

  return sportInterest.create({
    coniId: item.coniId,
    name: item.enParent,
    translations: {
      en: item.enParent,
      it: item.itParent
    }
  })
}
async function createChild (item) {
  const sportInterest = cw.ctr.sportInterest

  return sportInterest.create({
    coniId: item.coniId,
    name: item.enChild,
    parentId: item.parentId,
    translations: {
      en: item.enChild,
      it: item.itChild
    }
  })
}
cw.autoStart().then(async () => {
  try {
    csvtojson()
      .fromFile(csvPath)
      .then(async json => {
        for (const item of json) {
          await findOrCreate(item)
        }
        process.exit()
      })
  } catch (error) {
    console.log(error)
    process.exit()
  }
})
