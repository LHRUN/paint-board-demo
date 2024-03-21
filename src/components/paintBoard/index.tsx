import { useEffect, useRef, useState, MouseEvent } from 'react'
import './index.css'
import { leafPath, moonPath, musicPath } from './constant'

let isMouseDown = false
let moveDate = 0

const TypeMapPath = {
  music: musicPath,
  leaf: leafPath,
  moon: moonPath
}

const getMousePoint = (x: number, y: number) => {
  return {
    x: x - (window.innerWidth - 700) / 2,
    y: y - (window.innerHeight - 700) / 2
  }
}

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random();
  return `rgba(${r}, ${g}, ${b}, ${a})`
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
  const [pathType, setPathType] = useState<keyof typeof TypeMapPath>('music')

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
    if (now - moveDate < 50) {
      return
    }
    moveDate = now

    if (isMouseDown) {
      const { clientX, clientY } = event
      const point = getMousePoint(clientX, clientY)
      const points = generateRandomCoordinates(point.x, point.y, 30, 3)
      points.map((curPoint) => {
        createShape(curPoint.x, curPoint.y)
      })
    }
  }

  const createShape = (x: number, y: number) => {
    if (!context2D) {
      return
    }
    const path = new Path2D(TypeMapPath[pathType]);
    context2D.beginPath();
    context2D.fillStyle = getRandomColor();
    context2D.lineWidth = 2;

    context2D.save();
    context2D.translate(x, y);

    const scale = Math.random() * 1.5 + 0.5
    context2D.scale(scale, scale);

    context2D.fill(path);
    context2D.restore();
  }

  const onMouseUp = () => {
    if (!canvasRef?.current || !context2D) {
      return
    }
    isMouseDown = false
    moveDate = 0
  }

  return (
    <div className='container'>
      <div className='btns'>
        <button onClick={() => setPathType('music')}>Music</button>
        <button onClick={() => setPathType('leaf')}>Leaf</button>
        <button onClick={() => setPathType('moon')}>Moon</button>
      </div>
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
