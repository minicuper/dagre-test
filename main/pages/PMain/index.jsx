import React from 'react'
import {test} from '../../../lib/graph'
import Item from './Item'
import SVGDecorator from './SVGDecorator'

import './index.styl'
export default class PMain extends React.Component {

  render () {

    const graph = test()
    const items = graph.nodes().map(node => {
      return <Item
          {...graph.node(node)}
          key={node}
      />
    })

    console.log('items', items.length, items)

    return (
      <div className="root">
        {items}
        <SVGDecorator graph={graph}/>
      </div>
    )
  }

}
