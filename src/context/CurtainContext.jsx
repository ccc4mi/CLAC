import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePixelParser } from '../hooks/usePixelParser';
import { getPresetImageById } from '../utils/presets';

const CurtainContext = createContext();

export function CurtainProvider({ children }) {
    // default classic striped pattern image
    const [currentImage, setCurrentImage] = useState(() => getPresetImageById('default'));
    const [gridSize, setGridSize] = useState({ columns: 0, rows: 0 });

    // Fixed physics, sound and rendering parameters (without user-modifiable controls)
    const beadScale = 0.45;
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
            soundVolume
        }}>
            {children}
        </CurtainContext.Provider>
    );
}

export const useCurtain = () => useContext(CurtainContext);