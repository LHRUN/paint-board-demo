import { useEffect, useRef, useState, MouseEvent } from 'react'
import './index.css'

interface Point {
  x: number
  y: number
}

let isMouseDown = false
let movePoint: Point = { x: 0, y: 0 }

let counter = 0
const textValue = 'PaintBoard'
const minFontSize = 5

const getMousePoint = (x: number, y: number) => {
  return {
    x: x - (window.innerWidth - 800) / 2,
    y: y - (window.innerHeight - 800) / 2
  }
}

const getDistance = (start: Point, end: Point) => {
  return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2))
}

function PaintBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [context2D, setContext2D] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef?.current) {
      const context2D = canvasRef?.current.getContext('2d')
      if (context2D) {
        context2D.fillStyle = '#000'
        setContext2D(context2D)
      }
    }
  }, [canvasRef])

  const onMouseDown = (event: MouseEvent) => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    isMouseDown = true
    const { clientX, clientY } = event
    const point = getMousePoint(clientX, clientY)
    movePoint = {
      x: point.x,
      y: point.y
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    if (isMouseDown) {
      const { clientX, clientY } = event
      const point = getMousePoint(clientX, clientY)

      const distance = getDistance(movePoint, point)
      const fontSize = minFontSize + distance
      const letter = textValue[counter]
      context2D.font = `${fontSize}px Georgia`
      const textWidth = context2D.measureText(letter).width

      if (distance > textWidth) {
        const angle = Math.atan2(point.y - movePoint.y, point.x - movePoint.x)

        context2D.save();
        context2D.translate(movePoint.x, movePoint.y)
        context2D.rotate(angle);
        context2D.fillText(letter, 0, 0);
        context2D.restore();

        movePoint = {
          x: movePoint.x + Math.cos(angle) * textWidth,
          y: movePoint.y + Math.sin(angle) * textWidth
        }

        counter++
        if (counter > textValue.length - 1) {
          counter = 0
        }
      }
    }
  }

  const onMouseUp = () => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    isMouseDown = false
    movePoint = { x: 0, y: 0 }
  }

  return (
    <div className='container'>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="paint-board"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </div>
  )
}

export default PaintBoard
