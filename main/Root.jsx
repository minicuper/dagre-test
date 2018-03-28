import React, { PropTypes } from 'react'

export default class Root extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

  render () {
    let { children } = this.props

    return (
      <div>
        {children}
      </div>
    )
  }
}
