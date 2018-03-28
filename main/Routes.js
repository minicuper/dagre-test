import React from 'react'
import { Route, IndexRedirect } from 'react-router'
import Root from './Root'

import PMain from './pages/PMain'

export default (
  <Route path='/' component={Root}>
    <IndexRedirect to='editor' />
    <Route path='editor' component={PMain} />
  </Route>
)
