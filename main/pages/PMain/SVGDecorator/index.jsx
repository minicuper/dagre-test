import React from 'react'
import './index.styl'
import _ from 'lodash'

// Render the svg <path> element
// I:  - points (array): points coordinates
//     - command (function)
//       I:  - point (array) [x,y]: current point coordinates
//           - i (integer): index of 'point' in the array 'a'
//           - a (array): complete array of points coordinates
//       O:  - (string) a svg path command
// O:  - (string): a Svg <path> element
const svgPath = (points, command, attrs = {}) => {
  // build the d attributes by looping over the points
  const d = points.reduce((acc, point, i, a) => i === 0
        // if first point
          ? `M ${point[0]},${point[1]}`
        // else
          : `${acc} ${command(point, i, a)}`
      , '')
  return <path d={d} fill="none" stroke="#D0D0CE" strokeWidth="1" {...attrs}/>
}

// Properties of a line
// I:  - pointA (array) [x,y]: coordinates
//     - pointB (array) [x,y]: coordinates
// O:  - (object) { length: l, angle: a }: properties of the line
const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}

// Position of a control point
// I:  - current (array) [x, y]: current point coordinates
//     - previous (array) [x, y]: previous point coordinates
//     - next (array) [x, y]: next point coordinates
//     - reverse (boolean, optional): sets the direction
// O:  - (array) [x,y]: a tuple of coordinates
const controlPoint = (current, previous, next, reverse) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current
  // The smoothing ratio
  const smoothing = 0.2
  // Properties of the opposed-line
  const o = line(p, n)
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

const bezierCommand = (point, i, a) => {
  // start control point
  const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point)
  // end control point
  const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)
  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
}

// Svg path line command
// I:  - point (array) [x, y]: coordinates
// O:  - (string) 'L x,y': svg line command
const lineCommand = point => `L ${point[0]} ${point[1]}`

export default class SVGDecorator extends React.Component {
  shouldComponentUpdate (nextProps) {
    let oldData = this.props.data
    let newData = nextProps.data

    let oldReady = this.props.ready
    let newReady = nextProps.ready

    return oldReady !== newReady || !_.isEqual(oldData, newData)
  }

  getPositionById = (id, parent) => {
    let currentElement = document.getElementById(id)
    if (!currentElement) return []
    let rectPositions = currentElement.getBoundingClientRect()
    let secondCoordinateKey = parent ? 'right' : 'left'
    return [rectPositions[secondCoordinateKey], rectPositions.top + (rectPositions.height / 2)]
  }




  drawLines1 () {
    const lines = []
    const {data, radius} = this.props

    let r = radius || 20

    let rectPositions = this.svg.getBoundingClientRect()
    let {left, top} = rectPositions

    for (let element of data) {
      if (element.parentIds && element.parentIds.length > 0) {
        let [ elementX, elementY ] = this.getPositionById(element.id)
        for (let parentId of element.parentIds) {
          let [ parentX, parentY ] = this.getPositionById(parentId, true)
          let x1 = Math.round(parentX - left)
          let y1 = Math.round(parentY - top)
          let x2 = Math.round(elementX - left)
          let y2 = Math.round(elementY - top)
          let line = null


          // Simple line if the same level
          if (y1 === y2) {
            line = (
                <line
                    key={element.id + '_' + parentId}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth="1"
                    stroke="#D0D0CE"
                />)

            lines.push(line)
          } else {
            // the complex line
            // consists of 4 parts
            // AB - line
            // BC - Bézier curve
            // CD - line
            // DE - Bézier curve

            //                     E
            //                    /   DE
            //                D  /
            //                  |
            //                C |    CD
            //                 /
            //  A____________B/  BC
            //
            //        AB

            let sign = 1 // from top to bottom or vice versa
            if (y2 > y1) sign = -1

            let r2 = r // need the second radius if y1 and y2 are very close
            if (Math.abs(y2 - y1) < 2 * r) {
              r2 = Math.round(Math.abs(y2 - y1) / 2)
            }


            let AB = `M${x1},${y1} L${x2 - 2 * r}, ${y1} `
            let BC = `M${x2 - 2 * r}, ${y1} Q${x2 - r},${y1} ${x2 - r},${y1 - r2 * sign} `
            let CD = `M${x2 - r},${y1 - r2 * sign} L${x2 - r}, ${y2 + r2 * sign} `
            let DE = `M${x2 - r}, ${y2 + r2 * sign} Q${x2 - r}, ${y2} ${x2},${y2} `
            let path = AB + BC + CD + DE
            line = (
                <path
                    key={element.id + '_' + parentId}
                    d={path}
                    strokeWidth="1"
                    stroke="#D0D0CE"
                    fill="none"
                />
            )
            if (path.indexOf('NaN') === -1) lines.push(line)
          }
        }
      }
    }

    return lines
  }

  drawLines () {
    const lines = []
    const {graph} = this.props
    const x = 0
    const y = 0
    graph.edges().forEach(function(e) {
          const edge = graph.edge(e)
      console.log('edge', e, edge.points)
      const points = edge.points.map(it => ([it.x, it.y]))
      //const leftNode = graph.node(e.v)
      //const rightNode = graph.node(e.w)
      //points.unshift([leftNode.x, leftNode.y])
      //points.push([rightNode.x, rightNode.y])

      lines.push(svgPath(points, lineCommand, {key: e.v+'_'+e.w}))
          //for (let index = 1; index < edge.points.length; index++) {
          //  const left = edge.points[index-1]
          //  const right = edge.points[index]
          //  const line = (
          //        <line
          //            data-key={e.v+'_'+e.w+'_'+index}
          //            key={e.v+e.w+index}
          //            x1={left.x + x}
          //            y1={left.y + y}
          //            x2={right.x+x}
          //            y2={right.y+y}
          //            strokeWidth="1"
          //            stroke="#D0D0CE"
          //        />)
          //
          //  lines.push(line)
          //}line
        })



    return lines
  }

  render () {
    const lines = this.drawLines()
    console.log('lines', lines)
    return (
        <svg className='root' xmlns="http://www.w3.org/2000/svg" >
          {lines}
        </svg>
    )
  }
}