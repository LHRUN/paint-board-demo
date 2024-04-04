import { useEffect, useRef, useState, MouseEvent } from 'react'
import './index.css'

let isMouseDown = false
let movePoint: { x: number, y: number } | null = null

const getMousePoint = (x: number, y: number) => {
  return {
    x: x - (window.innerWidth - 500) / 2,
    y: y - (window.innerHeight - 500) / 2
  }
}

const materialImage = new Promise<HTMLImageElement>((resolve) => {
  const image = new Image()
  image.src = '/crayon.png'
  image.onload = () => {
    resolve(image)
  }
})

const getPattern = async (color: string) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  canvas.width = 100
  canvas.height = 100
  context.fillStyle = color
  context.fillRect(0, 0, 100, 100)
  const image = await materialImage
  if (image) {
    context.drawImage(image, 0, 0, 100, 100)
  }
  return context.createPattern(canvas, 'repeat')
}

function PaintBoard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [context2D, setContext2D] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    initDraw()
  }, [canvasRef])

  const initDraw = async () => {
    if (canvasRef?.current) {
      const context2D = canvasRef?.current.getContext('2d')
      if (context2D) {
        context2D.lineCap = 'round'
        context2D.lineJoin = 'round'
        context2D.lineWidth = 10
        const pattern = await getPattern('blue')
        if (pattern) {
          context2D.strokeStyle = pattern
        }
        
        setContext2D(context2D)
      }
    }
  }

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
        context2D.beginPath()
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
