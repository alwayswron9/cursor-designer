import { useState, useEffect } from 'react'
import { clsx } from 'clsx'

export default function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [aspectRatio, setAspectRatio] = useState('16/9')
  
  useEffect(() => {
    const updateDimensions = () => {
      const vh = window.innerHeight
      const vw = window.innerWidth
      
      // Target aspect ratio (you can make this dynamic if needed)
      const targetRatio = 1 / 1
      
      let width = vw
      let height = width / targetRatio
      
      // If height is too tall for viewport, scale based on height instead
      if (height > vh) {
        height = vh
        width = height * targetRatio
      }
      
      // Add some margin to prevent any possible scroll
      width *= 0.95
      height *= 0.95
      
      setDimensions({ width, height })
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Calculate canvas dimensions to maintain aspect ratio and fit screen
  const calculateCanvasDimensions = () => {
    const [width, height] = aspectRatio.split('/').map(Number)
    const ratio = width / height
    
    // Account for padding (16px * 2 = 32px)
    const maxWidth = dimensions.width - 32
    const maxHeight = dimensions.height - 96 // Account for padding and select box

    // Calculate dimensions that maintain aspect ratio and fit within bounds
    let finalWidth = maxWidth
    let finalHeight = maxWidth / ratio

    // If height exceeds available space, scale down based on height
    if (finalHeight > maxHeight) {
      finalHeight = maxHeight
      finalWidth = maxHeight * ratio
    }

    return {
      width: finalWidth,
      height: finalHeight
    }
  }

  const canvasDimensions = calculateCanvasDimensions()

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
        className="bg-white shadow-lg relative"
      >
        <div className="mb-4">
          <select 
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="16/9">16:9</option>
            <option value="4/3">4:3</option>
            <option value="1/1">1:1</option>
            <option value="9/16">9:16 (Mobile)</option>
          </select>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-0">
          <div 
            className={clsx(
              "bg-white shadow-lg transition-all duration-300",
              "flex items-center justify-center"
            )}
            style={{
              width: canvasDimensions.width,
              height: canvasDimensions.height
            }}
          >
            {/* Example content */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-red-500 rounded-full" />
            <div className="absolute top-0 right-0 w-0 h-0 border-l-[100px] border-l-transparent border-t-[100px] border-t-green-500" />
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
              Design Something Amazing
            </h1>
            <div className="absolute bottom-8 right-8">
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                alt="Beach"
                className="w-64 h-40 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 