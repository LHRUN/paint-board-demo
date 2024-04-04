import { useEffect, useRef, useState, MouseEvent } from 'react'
import './index.css'

interface Point {
  x: number
  y: number
}

let isMouseDown = false
let movePoints: Point[] = []

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
        context2D.lineWidth = 3
        
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
      const length = movePoints.length
      if (length) {
        context2D.beginPath()
        context2D.moveTo(movePoints[length - 1].x, movePoints[length - 1].y)
        context2D.lineTo(point.x, point.y)
        context2D.stroke()

        if (length % 2 === 0) {
          const limitDistance = 1000
          for (let i = 0; i < length; i++) {
            const dx = movePoints[i].x - movePoints[length - 1].x
            const dy = movePoints[i].y - movePoints[length - 1].y
            const d = dx * dx + dy * dy
        
            if (d < limitDistance) {
              context2D.save()
              context2D.beginPath()
              context2D.lineWidth = 1
              context2D.moveTo(movePoints[length - 1].x, movePoints[length - 1].y)
              context2D.lineTo(movePoints[i].x, movePoints[i].y)
              context2D.stroke()
              context2D.restore()
            }
          }
        }
      }
      movePoints.push(point)
    }
  }

  const onMouseUp = () => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    isMouseDown = false
    movePoints = []
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
