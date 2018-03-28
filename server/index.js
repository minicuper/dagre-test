import express from 'express'
import shareDbServer from 'dm-sharedb-server'
import mainRoutes from '../main/Routes'
import ShareDB from 'sharedb'
import richText from 'rich-text'
import derbyAr from 'derby-ar'
import Racer from 'racer'
import ormEntities from '../model'

const ROOT_PATH = process.cwd()
const TMP_PATH = ROOT_PATH + '/tmp'

let getHead

// Register rich-text type in ShareDB
ShareDB.types.register(richText.type)

// Init ORM
Racer.use(derbyAr)
Racer.use(ormEntities)

export default (done) => {
  shareDbServer({
    appRoutes: {
      main: mainRoutes
    },
    getHead: getHead,
    beforeStart: beforeStart
  }, (ee, options) => {
    ee.on('backend', (backend) => {
      // let model = backend.createModel()
      // model.destroy()
    })

    ee.on('middleware', (expressApp) => {
      expressApp.use('/js/quill', express.static('node_modules/quill/dist'))
      // expressApp.use(middleware1)
      // expressApp.use(middleware2)
    })

    ee.on('routes', (expressApp) => {
      // expressApp.use(api)
    })

    ee.on('done', () => {
      done && done()
    })
  })
}

// One-time init right before we start to listen for incoming connections.
function beforeStart (backend, cb) {
  // let model = backend.createModel()
  // model.destroy()
  cb && cb()
}

getHead = (appName) => `
<title>Test App</title>
<link href='/js/quill/quill.bubble.css' rel='stylesheet' />
`
