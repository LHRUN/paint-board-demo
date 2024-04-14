import { useEffect, useRef, useState, MouseEvent } from 'react'
import './index.css'

interface Point {
  x: number
  y: number
}

let isMouseDown = false
let moveTime = 0
let movePoint: Point = { x: 0, y: 0 }
let flip = 1

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
        context2D.strokeStyle = '#000'
        context2D.lineJoin = 'round'
        context2D.lineCap = 'round'
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

    const now = Date.now()
    if (now - moveTime < 30) {
      return
    }
    moveTime = now

    if (isMouseDown) {
      const { clientX, clientY } = event
      const point = getMousePoint(clientX, clientY)
      const distance = getDistance(movePoint, point)

      const midX = (movePoint.x + point.x) / 2
      const midY = (movePoint.y + point.y) / 2

      context2D.beginPath();
      context2D.save();

      const angle = Math.atan2(point.y - movePoint.y, point.x - movePoint.x)
      const flipAngle = (flip % 2) * Math.PI

      context2D.arc(
        midX,
        midY,
        distance / 2,
        angle + flipAngle,
        angle + flipAngle + Math.PI
      );
      context2D.stroke();
      context2D.restore();

      flip++;
      movePoint = {
        x: point.x,
        y: point.y
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