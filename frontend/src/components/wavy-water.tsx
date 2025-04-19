"use client"

import { useEffect, useRef } from "react"

export function WavyWater() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = 60
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let animationFrameId: number
    let offset = 0

    // Draw wave
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the wave
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      // Fill below the wave
      for (let x = 0; x <= canvas.width; x++) {
        const y = Math.sin(x * 0.01 + offset) * 10 + 30
        ctx.lineTo(x, y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()

      // Fill with a dark blue color
      ctx.fillStyle = "#BBE1FF"
      ctx.fill()

      // Animate
      offset += 0.05
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-[60px]" style={{ display: "block" }} />
}
