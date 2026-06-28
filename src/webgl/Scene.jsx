import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Curtain } from './Curtain'

export function Scene({ pixelData }) {
    return (
        <div 
            id="curtain-canvas-container"
            style={{ 
                width: '100vw', 
                height: '100vh', 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                zIndex: 1, 
                pointerEvents: 'none', // Allows interaction with the UI below, we capture mouse globally
                overflow: 'hidden'
            }}
        >
            <Canvas
                orthographic
                camera={{ zoom: 45, position: [0, 0, 20] }}
                gl={{ 
                    preserveDrawingBuffer: true,
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
            >
                {/* Premium lighting to highlight the 3D relief and shine of the plastic beads */}
                <ambientLight intensity={0.5} />
                
                {/* Soft bounce / ambient light */}
                <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#080820" />
                
                {/* Directional light for specular highlights on the plastic */}
                <directionalLight 
                    position={[8, 12, 10]} 
                    intensity={1.2} 
                    color="#ffffff" 
                />

                <Curtain pixelData={pixelData} />
            </Canvas>
        </div>
    )
}