import { useEffect, useRef, useState, MouseEvent } from 'react'
import './index.css'

let isMouseDown = false
let moveDate = 0
const drawWidth = 15
const step = 5

const getMousePoint = (x: number, y: number) => {
  return {
    x: x - (window.innerWidth - 500) / 2,
    y: y - (window.innerHeight - 500) / 2
  }
}

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 1)`
}

function PaintBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [context2D, setContext2D] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef?.current) {
      const context2D = canvasRef?.current.getContext('2d')
      if (context2D) {
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

    const now = new Date().getTime()
    if (now - moveDate < 30) {
      return
    }
    moveDate = now

    if (isMouseDown) {
      const { clientX, clientY } = event
      const point = getMousePoint(clientX, clientY)
      
      for (let i = -drawWidth; i < drawWidth; i += step) {
        for (let j = -drawWidth; j < drawWidth; j += step) {
          if (Math.random() > 0.5) {
            context2D.save();
            context2D.fillStyle = getRandomColor();
            context2D.fillRect(point.x + i, point.y + j, step, step);
            context2D.fill();
            context2D.restore();
          }
        }
      }
    }
  }

  const onMouseUp = () => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    isMouseDown = false
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
