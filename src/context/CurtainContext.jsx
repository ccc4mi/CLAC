import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePixelParser } from '../hooks/usePixelParser';
import { getPresetImageById } from '../utils/presets';

const CurtainContext = createContext();

export function CurtainProvider({ children }) {
    // default classic striped pattern image
    const [currentImage, setCurrentImage] = useState(() => getPresetImageById('default'));
    const [gridSize, setGridSize] = useState({ columns: 0, rows: 0 });

    const isMobile = typeof window !== 'undefined' && typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const performanceMode = isMobile;

    // Dynamic bead scale based on device and performance setting
    const beadScale = isMobile ? 0.80 : 0.45;

    const physicsSensitivity = 1.0;
    const soundEnabled = true;
    const soundVolume = 5;

    const { pixelData, parseImage, isLoading } = usePixelParser();

    // Re-parse whenever the image or grid size changes
    useEffect(() => {
        if (gridSize.columns > 0 && gridSize.rows > 0) {
            parseImage(currentImage, gridSize.columns, gridSize.rows);
        }
    }, [currentImage, gridSize, parseImage]);

    return (
        <CurtainContext.Provider value={{
            currentImage,
            setCurrentImage,
            gridSize,
            setGridSize,
            pixelData,
            isLoading,
            beadScale,
            physicsSensitivity,
            soundEnabled,
            soundVolume,
            performanceMode
        }}>
            {children}
        </CurtainContext.Provider>
    );
}

export const useCurtain = () => useContext(CurtainContext);