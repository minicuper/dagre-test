import React from 'react'
import { Router, browserHistory } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import ShareDB from 'sharedb/lib/client'
import richText from 'rich-text'
import derbyAr from 'derby-ar'
import Racer from 'racer'
import ormEntities from '../model'
import ReactDom from 'react-dom'
import { model } from 'react-sharedb'

// Styles
import './styles/index.styl'

// Routes should be imported after the base styles
import Routes from './Routes'

// Import ui components here since some of them are just stylesheets
import './components/ui'

// Init ORM
Racer.use(derbyAr)
Racer.use(ormEntities)

// Add Rich Text support to ShareDB client-side
ShareDB.types.register(richText.type)

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

// Jump to the top of the page on each page render
function onUpdate () {
  window.scrollTo(0, 0)
}

let createElement = (Component, props) => {
  // Destroy all data and remove refs from '_page' (which is used as a simple global
  // app state storage instead of redux)
  model.silent().destroy('_page')
  return <Component key={props.route.path + JSON.stringify(props.routeParams)} {...props} />
}

let router = (
  <Router createElement={createElement} history={browserHistory} onUpdate={onUpdate}>
    {Routes}
  </Router>
)

let app = document.getElementById('app')
// HACK: make react happy on overriding server elements
app.innerHTML = ''
ReactDom.render(router, app)
