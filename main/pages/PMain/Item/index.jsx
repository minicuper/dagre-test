import React from 'react'
import './index.styl'

export default class Item extends React.Component {
  render () {
    const {x, y, width, height, label} = this.props
    const style = {
      width,
      height,
      transform: `translate(${x - width / 2}px, ${y - height / 2}px)`
    }

    console.log(style)
    return (
        <div style={style} className="root">
          <div>{label}</div>
        </div>
    )
  }
}