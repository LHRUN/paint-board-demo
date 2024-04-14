import { useEffect, useRef, useState, MouseEvent } from 'react'
import './index.css'

interface Point {
  x: number
  y: number
}

let isMouseDown = false
let moveDate = 0
let lastPoints: Point[] = []

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 1)`
}

const getMousePoint = (x: number, y: number) => {
  return {
    x: x - (window.innerWidth - 700) / 2,
    y: y - (window.innerHeight - 700) / 2
  }
}

const generateRandomCoordinates = (
  centerX: number,
  centerY: number,
  size: number,
  count: number
) => {
  const halfSize = size / 2
  const points = []

  for (let i = 0; i < count; i++) {
    const randomX = Math.floor(centerX - halfSize + Math.random() * size)
    const randomY = Math.floor(centerY - halfSize + Math.random() * size)
    points.push({ x: randomX, y: randomY })
  }

  return points
}

function PaintBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [context2D, setContext2D] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef?.current) {
      const context2D = canvasRef?.current.getContext('2d')
      if (context2D) {
        context2D.fillStyle = '#000000';
        context2D.strokeStyle = '#000000';
        context2D.lineWidth = 1;
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
    if (now - moveDate < 50) {
      return
    }
    moveDate = now

    if (isMouseDown) {
      const { clientX, clientY } = event
      const point = getMousePoint(clientX, clientY)
      const points = generateRandomCoordinates(point.x, point.y, 50, 3)
      draw(points)
      lastPoints = points
    }
  }

  const draw = (points: Point[]) => {
    if (!context2D) {
      return
    }

    if (lastPoints.length) {
      lastPoints.forEach(({ x, y }, index) => {
        context2D.beginPath();
        context2D.save();
        context2D.globalCompositeOperation = "destination-over";
        context2D.strokeStyle = getRandomColor();
        context2D.moveTo(x, y);
        context2D.lineTo(points[index].x, points[index].y);
        context2D.stroke();
        context2D.restore();
      })
    }

    points.map((curPoint) => {
      context2D.beginPath();
      context2D.save();
      context2D.fillStyle = getRandomColor();
      context2D.arc(curPoint.x, curPoint.y, 7, 0, 2 * Math.PI, false);
      context2D.fill();
      context2D.restore();
    })
  }

  const onMouseUp = () => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    isMouseDown = false
    moveDate = 0
    lastPoints = []
  }

  return (
    <div className='container'>
      <canvas
        ref={canvasRef}
        width={700}
        height={700}
        className="paint-board"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </div>
  )
}

export default PaintBoard