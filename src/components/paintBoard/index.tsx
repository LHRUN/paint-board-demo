import { useEffect, useRef, useState, MouseEvent } from 'react'
import './index.css'

let hue = 0
let isMouseDown = false
let movePoint: { x: number, y: number } | null = null

const getMousePoint = (x: number, y: number) => {
  return {
    x: x - (window.innerWidth - 500) / 2,
    y: y - (window.innerHeight - 500) / 2
  }
}

function PaintBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [context2D, setContext2D] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef?.current) {
      const context2D = canvasRef?.current.getContext('2d')
      if (context2D) {
        context2D.lineCap = 'round'
        context2D.lineJoin = 'round'
        context2D.lineWidth = 10

        setContext2D(context2D)
      }
    }
  }, [canvasRef])

  const onMouseDown = () => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    isMouseDown = true
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    if (isMouseDown) {
      const { clientX, clientY } = event
      const point = getMousePoint(clientX, clientY)
      if (movePoint) {
        hue = hue < 360 ? hue + 1 : 0

        context2D.beginPath()
        context2D.strokeStyle = `hsl(${hue}, 90%, 50%)`
        context2D.moveTo(movePoint.x, movePoint.y)
        context2D.lineTo(point.x, point.y)
        context2D.stroke()
      }
      movePoint = point
    }
  }

  const onMouseUp = () => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    isMouseDown = false
    movePoint = null
  }

  return (
    <div className='container'>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="paint-board"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </div>
  )
}

export default PaintBoard
