import React, { useMemo } from 'react'
import * as THREE from 'three'

export function LinkGeometry() {
    const shape = useMemo(() => {
        const s = new THREE.Shape()
        
        // Detailed outer contour based on the retro link from the photo
        
        // Top left prong
        s.moveTo(-0.16, 0.48)
        s.lineTo(-0.06, 0.48) 
        // Gap goes down
        s.lineTo(-0.06, 0.36) 
        s.lineTo(0.06, 0.36)  
        // Inner edge of right prong goes up
        s.lineTo(0.06, 0.48)
        s.lineTo(0.16, 0.48)  
        
        // Right side
        s.lineTo(0.16, 0.36)
        s.lineTo(0.28, 0.10)  // Widest point
        s.lineTo(0.14, -0.25) // Narrowing to bottom
        s.lineTo(0.06, -0.25) // Start of bottom tail
        s.lineTo(0.06, -0.38) // Right edge of bottom tail
        s.lineTo(-0.06, -0.38) // Bottom edge of tail
        s.lineTo(-0.06, -0.25) // Left edge of bottom tail
        s.lineTo(-0.14, -0.25) // Narrowing to bottom
        s.lineTo(-0.28, 0.10) // Widest point left
        s.lineTo(-0.16, 0.36) // Left side
        
        s.closePath()

        // Helper function for 6-pointed star holes
        const createStarHole = (x, y, outerR, innerR, points) => {
            const path = new THREE.Path()
            const step = Math.PI / points
            for (let i = 0; i < 2 * points; i++) {
                const radius = i % 2 === 0 ? outerR : innerR
                const angle = i * step - Math.PI / 2
                const px = x + radius * Math.cos(angle)
                const py = y + radius * Math.sin(angle)
                if (i === 0) path.moveTo(px, py)
                else path.lineTo(px, py)
            }
            path.closePath()
            return path
        }

        // Upper central slit
        const upperSlot = new THREE.Path()
        upperSlot.moveTo(-0.02, 0.28)
        upperSlot.lineTo(0.02, 0.28)
        upperSlot.lineTo(0.02, 0.10)
        upperSlot.lineTo(-0.02, 0.10)
        upperSlot.closePath()
        s.holes.push(upperSlot)

        // Lower central slit
        const lowerSlot = new THREE.Path()
        lowerSlot.moveTo(-0.02, 0.04)
        lowerSlot.lineTo(0.02, 0.04)
        lowerSlot.lineTo(0.02, -0.15)
        lowerSlot.lineTo(-0.02, -0.15)
        lowerSlot.closePath()
        s.holes.push(lowerSlot)

        // 4 Star Holes
        s.holes.push(createStarHole(-0.14, 0.19, 0.04, 0.018, 6))
        s.holes.push(createStarHole(0.14, 0.19, 0.04, 0.018, 6))
        s.holes.push(createStarHole(-0.12, -0.05, 0.035, 0.015, 6))
        s.holes.push(createStarHole(0.12, -0.05, 0.035, 0.015, 6))

        return s
    }, [])

    return (
        <extrudeGeometry
            args={[shape, { 
                depth: 0.035, 
                bevelEnabled: true, 
                bevelSegments: 2, 
                steps: 1, 
                bevelSize: 0.008, 
                bevelThickness: 0.008 
            }]}
        />
    )
}