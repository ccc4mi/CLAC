import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LinkGeometry } from './Link'
import { useCurtain } from '../context/CurtainContext'
import { audioSynth } from '../utils/audio'

export function Curtain({ pixelData }) {
    const { viewport } = useThree()
    const { width, height } = viewport
    const instancesRef = useRef()

    const {
        setGridSize,
        beadScale,
        physicsSensitivity,
        soundEnabled,
        soundVolume
    } = useCurtain()

    // Sync sound configurations
    useEffect(() => {
        audioSynth.setEnabled(soundEnabled)
        audioSynth.setVolume(soundVolume)
    }, [soundEnabled, soundVolume])

    // Enclosure dimensions for each virtual link (affected by the chosen scale)
    const baseLinkWidth = 0.52
    const baseLinkHeight = 0.72
    const linkWidth = baseLinkWidth * beadScale
    const linkHeight = baseLinkHeight * beadScale

    // Calculate the number of columns and rows that fit on the screen
    const columns = useMemo(() => Math.ceil(width / linkWidth) + 2, [width, linkWidth])
    const rows = useMemo(() => Math.ceil(height / linkHeight) + 2, [height, linkHeight])

    // Notify the context of the grid size so usePixelParser recalculates the colors
    useEffect(() => {
        if (columns > 0 && rows > 0) {
            setGridSize({ columns, rows })
        }
    }, [columns, rows, setGridSize])

    // Store the global position and normalized mouse/finger speed
    const pointerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, active: false })
    const shakeRef = useRef({ ax: 0, az: 0 })

    useEffect(() => {
        let lastX = null
        let lastY = null

        // Device motion for shaking
        const handleMotion = (event) => {
            if (!event.acceleration) return;
            const { x, z } = event.acceleration;
            
            // Ignore micro-jitters
            if (Math.abs(x) > 1.5 || Math.abs(z) > 1.5) {
                // Accumulate shake force
                shakeRef.current.ax += (x || 0) * 0.05;
                shakeRef.current.az += (z || 0) * 0.05;
            }
        }
        window.addEventListener('devicemotion', handleMotion, false)

        // Request permission on first interaction (required for iOS 13+)
        const handleFirstInteraction = () => {
            if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                DeviceMotionEvent.requestPermission().catch(() => {})
            }
            window.removeEventListener('click', handleFirstInteraction)
            window.removeEventListener('touchstart', handleFirstInteraction)
        }
        window.addEventListener('click', handleFirstInteraction)
        window.addEventListener('touchstart', handleFirstInteraction)

        const handlePointerDown = (e) => {
            lastX = e.clientX
            lastY = e.clientY
            pointerRef.current.active = true
        }

        const handlePointerMove = (e) => {
            const currentX = e.clientX
            const currentY = e.clientY

            if (lastX !== null && lastY !== null) {
                const dx = currentX - lastX
                const dy = currentY - lastY

                pointerRef.current.vx = dx / window.innerWidth
                pointerRef.current.vy = dy / window.innerHeight

                // If the movement is predominantly vertical, it's a scroll
                // Temporarily disable pushing physics
                if (Math.abs(dy) > Math.abs(dx) * 1.5) {
                    pointerRef.current.active = false
                } else {
                    pointerRef.current.active = true
                }
            }

            lastX = currentX
            lastY = currentY

            const x = (currentX / window.innerWidth) * 2 - 1
            const y = -(currentY / window.innerHeight) * 2 + 1
            pointerRef.current.x = x
            pointerRef.current.y = y
        }

        const handleTouchStart = (e) => {
            if (e.touches.length > 0) {
                lastX = e.touches[0].clientX
                lastY = e.touches[0].clientY
                pointerRef.current.active = true
            }
        }

        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0]
                const currentX = touch.clientX
                const currentY = touch.clientY

                if (lastX !== null && lastY !== null) {
                    const dx = currentX - lastX
                    const dy = currentY - lastY

                    pointerRef.current.vx = dx / window.innerWidth
                    pointerRef.current.vy = dy / window.innerHeight

                    // If it's a vertical swipe (to scroll), disable physics
                    if (Math.abs(dy) > Math.abs(dx) * 1.5) {
                        pointerRef.current.active = false
                    } else {
                        pointerRef.current.active = true
                    }
                }

                lastX = currentX
                lastY = currentY

                const x = (currentX / window.innerWidth) * 2 - 1
                const y = -(currentY / window.innerHeight) * 2 + 1
                pointerRef.current.x = x
                pointerRef.current.y = y
            }
        }

        const handlePointerLeave = () => {
            pointerRef.current.active = false
            pointerRef.current.vx = 0
            pointerRef.current.vy = 0
            lastX = null
            lastY = null
        }

        window.addEventListener('pointerdown', handlePointerDown)
        window.addEventListener('pointermove', handlePointerMove)
        window.addEventListener('touchstart', handleTouchStart, { passive: true })
        window.addEventListener('touchmove', handleTouchMove, { passive: true })
        window.addEventListener('pointerleave', handlePointerLeave)
        window.addEventListener('touchend', handlePointerLeave)

        return () => {
            window.removeEventListener('devicemotion', handleMotion)
            window.removeEventListener('click', handleFirstInteraction)
            window.removeEventListener('touchstart', handleFirstInteraction)
            window.removeEventListener('pointerdown', handlePointerDown)
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('pointerleave', handlePointerLeave)
            window.removeEventListener('touchend', handlePointerLeave)
        }
    }, [])

    // Create the grid of independent physical links
    const linksArray = useMemo(() => {
        const list = []
        const startX = -width / 2
        const startY = height / 2

        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows; r++) {
                list.push({
                    x: startX + c * linkWidth,
                    y: startY - r * linkHeight,
                    z: 0,
                    baseX: startX + c * linkWidth, // Original position
                    vx: 0,
                    ax: 0,
                    vz: 0,
                    column: c,
                    row: r,
                    lastSoundTime: 0
                })
            }
        }
        return list
    }, [columns, rows, width, height, linkWidth, linkHeight])

    // Pre-allocated auxiliary structures to avoid GC thrashing in simulation loop
    const tempObject = useMemo(() => new THREE.Object3D(), [])
    const tempColor = useMemo(() => new THREE.Color(), [])
    
    // Reactive flag to update colors on the InstancedMesh
    const colorsNeedUpdateRef = useRef(true)

    useEffect(() => {
        colorsNeedUpdateRef.current = true
    }, [linksArray, pixelData, columns, rows])

    // 60 FPS physical simulation loop
    useFrame((state) => {
        if (!instancesRef.current) return

        const mesh = instancesRef.current
        const targetX = (pointerRef.current.x * width) / 2
        const targetY = (pointerRef.current.y * height) / 2
        const pointerActive = pointerRef.current.active

        const globalSensitivity = physicsSensitivity

        // 1. Lazy update colors on the InstancedMesh only when they actually change
        if (colorsNeedUpdateRef.current) {
            colorsNeedUpdateRef.current = false
            for (let i = 0; i < linksArray.length; i++) {
                const link = linksArray[i]
                let color = [0.96, 0.92, 0.84] // Classic butter white

                if (pixelData && pixelData.length > 0) {
                    const idx = link.row * columns + link.column
                    if (pixelData[idx]) {
                        color = pixelData[idx].color
                    }
                } else {
                    // Simple fallback pattern in case the parse fails
                    if (link.row > rows - 3) color = [0.12, 0.47, 0.17] // Green
                    else if (link.column > 10 && link.column < 25 && link.row < 18) color = [0.19, 0.11, 0.11] // Dark brown
                }
                tempColor.setRGB(color[0], color[1], color[2])
                mesh.setColorAt(i, tempColor)
            }
            if (mesh.instanceColor) {
                mesh.instanceColor.needsUpdate = true
            }
        }

        // Decay device shake over time
        const currentShakeX = shakeRef.current.ax
        const currentShakeZ = shakeRef.current.az
        shakeRef.current.ax *= 0.8
        shakeRef.current.az *= 0.8

        // Fast decay of pointer speed (if the mouse is still, speed drops to 0)
        pointerRef.current.vx *= 0.5
        pointerRef.current.vy *= 0.5

        // Convert normalized speed into force
        const pVx = pointerRef.current.vx * 150
        const pVz = Math.abs(pointerRef.current.vx * 50) + Math.abs(pointerRef.current.vy * 50)

        // 2. Accumulate forces per column (optimized grid traversal)
        const colPushX = new Float32Array(columns)
        const colPushZ = new Float32Array(columns)
        let playSound = false
        let soundForce = 0

        if (pointerActive && (Math.abs(pVx) > 0.1 || Math.abs(pVz) > 0.1)) {
            const effectRadius = 1.0 * beadScale
            const effectRadiusSq = effectRadius * effectRadius

            const startX = -width / 2
            const startY = height / 2

            // Calculate grid coords for the pointer
            const targetCol = Math.round((targetX - startX) / linkWidth)
            const targetRow = Math.round((startY - targetY) / linkHeight)

            // Bounds for checking neighboring eslabones
            const colRadius = Math.ceil(effectRadius / linkWidth) + 1
            const rowRadius = Math.ceil(effectRadius / linkHeight) + 1

            const minCol = Math.max(0, targetCol - colRadius)
            const maxCol = Math.min(columns - 1, targetCol + colRadius)
            const minRow = Math.max(0, targetRow - rowRadius)
            const maxRow = Math.min(rows - 1, targetRow + rowRadius)

            for (let c = minCol; c <= maxCol; c++) {
                for (let r = minRow; r <= maxRow; r++) {
                    const idx = c * rows + r
                    const link = linksArray[idx]
                    if (!link) continue

                    const dx = link.x - targetX
                    const dy = link.y - targetY
                    const distanceSq = dx * dx + dy * dy

                    // Use squared distance check first to bypass slow Math.sqrt calls
                    if (distanceSq < effectRadiusSq) {
                        const distance = Math.sqrt(distanceSq)
                        const force = (1.0 - distance / effectRadius) * globalSensitivity

                        // Push in the direction the mouse is moving (pVx)
                        colPushX[link.column] += pVx * force * 0.10
                        // Always push a bit towards the background (Z) to simulate 3D relief
                        colPushZ[link.column] += pVz * force * 0.10

                        const speed = Math.sqrt(link.vx * link.vx + link.vz * link.vz)
                        const now = state.clock.getElapsedTime()
                        if (distance < 0.6 * beadScale && speed < 0.08 && now - link.lastSoundTime > 0.15) {
                            playSound = true
                            soundForce = Math.abs(pVx) * force
                            link.lastSoundTime = now
                        }
                    }
                }
            }

            if (playSound) {
                audioSynth.playClack(Math.min(1.0, soundForce * 3.0))
            }
        }

        // 3. String simulation (Position Based Dynamics)
        const damping = 0.90 // Momentum conservation
        const gravity = 0.01 // How fast it returns to vertical center
        const stiffness = 0.75 // 0.0 to 1.0. Higher = less snaking, firmer chain.

        for (let i = 0; i < linksArray.length; i++) {
            const link = linksArray[i]

            // Apply device shake globally to all links
            if (Math.abs(currentShakeX) > 0.001 || Math.abs(currentShakeZ) > 0.001) {
                // Higher rows (bottom of curtain) should swing more than top rows
                const swingFactor = (link.row / rows) * globalSensitivity
                link.vx += currentShakeX * swingFactor
                link.vz += currentShakeZ * swingFactor
                
                // Sound effect for shaking
                const shakeForce = Math.abs(currentShakeX) + Math.abs(currentShakeZ)
                const speed = Math.sqrt(link.vx * link.vx + link.vz * link.vz)
                const now = state.clock.getElapsedTime()
                
                if (shakeForce > 0.1 && speed > 0.1 && now - link.lastSoundTime > 0.3 && Math.random() > 0.98) {
                    audioSynth.playClack(Math.min(1.0, shakeForce * 2.0))
                    link.lastSoundTime = now
                }
            }

            // Apply the column's push to this link
            if (colPushX[link.column] !== 0) {
                const spreadFactor = (link.row / rows)
                link.vx += colPushX[link.column] * spreadFactor * 0.28
                link.vz += colPushZ[link.column] * spreadFactor * 0.28
            }

            if (link.row === 0) {
                // The first link is strongly anchored to its base
                link.vx += (link.baseX - link.x) * 0.2
                link.vx *= damping
                link.x += link.vx

                link.vz += (0 - link.z) * 0.2
                link.vz *= damping
                link.z += link.vz
            } else {
                const prevLink = linksArray[i - 1]
                const prevZ = prevLink.z

                // 1. Apply inertia and gravity
                link.vx += (link.baseX - link.x) * gravity
                link.vx *= damping
                // Safety cap
                link.vx = Math.max(-1.0, Math.min(1.0, link.vx))
                link.x += link.vx

                link.vz += (0 - link.z) * gravity
                link.vz *= damping
                link.vz = Math.max(-1.0, Math.min(1.0, link.vz))
                link.z += link.vz

                // 2. Resolve rigid connections (PBD - Position Based Dynamics)
                // Forces the link to follow the one above it almost instantly
                const dx = prevLink.x - link.x
                link.x += dx * stiffness
                link.vx += dx * stiffness * 0.3 // Transmit inertia

                const dz = prevZ - link.z
                link.z += dz * stiffness
                link.vz += dz * stiffness * 0.3
            }

            // 4. Update the matrix of the instance directly on the GPU
            tempObject.position.set(link.x, link.y, link.z)
            tempObject.scale.set(beadScale, beadScale, beadScale)
            tempObject.updateMatrix()
            mesh.setMatrixAt(i, tempObject.matrix)
        }

        // Notify Three.js that the instance matrices have changed
        mesh.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh
            ref={instancesRef}
            args={[undefined, undefined, linksArray.length]}
        >
            <LinkGeometry />
            <meshStandardMaterial
                roughness={0.25}
                metalness={0.2}
                envMapIntensity={1.0}
            />
        </instancedMesh>
    )
}