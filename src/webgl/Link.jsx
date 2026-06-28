import React, { useMemo } from 'react'
import * as THREE from 'three'

export function LinkGeometry() {
    const shape = useMemo(() => {
        const s = new THREE.Shape()
        
        // Detailed outer contour based on the retro link from the photo:
        // Includes the top hooking stem and the rounded hexagonal body
        s.moveTo(-0.025, 0.48)  // Top of the upper left hook
        s.lineTo(0.025, 0.48)   // Top of the upper right hook
        s.lineTo(0.025, 0.36)   // Base of the right hook
        
        s.lineTo(0.18, 0.34)    // Upper right shoulder
        s.lineTo(0.25, 0.08)    // Protruding right side
        s.lineTo(0.18, -0.34)   // Lower right shoulder
        
        s.lineTo(-0.18, -0.34)  // Lower left shoulder
        s.lineTo(-0.25, 0.08)   // Protruding left side
        s.lineTo(-0.18, 0.34)   // Upper left shoulder
        
        s.lineTo(-0.025, 0.36)  // Base of the left hook
        s.closePath()

        // 1. Large central circular hole (characteristic of the photo)
        const circleHole = new THREE.Path()
        circleHole.absarc(0, 0.02, 0.10, 0, Math.PI * 2, true)
        s.holes.push(circleHole)

        // 2. Vertical slot/groove at the bottom of the link
        const bottomSlot = new THREE.Path()
        bottomSlot.moveTo(-0.02, -0.16)
        bottomSlot.lineTo(0.02, -0.16)
        bottomSlot.lineTo(0.02, -0.34)
        bottomSlot.lineTo(-0.02, -0.34)
        bottomSlot.closePath()
        s.holes.push(bottomSlot)

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