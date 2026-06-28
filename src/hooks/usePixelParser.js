import { useState, useCallback } from 'react';

export function usePixelParser() {
    const [pixelData, setPixelData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const parseImage = useCallback((imageSrc, columnas, filas) => {
        if (!imageSrc || columnas === 0 || filas === 0) return;

        setIsLoading(true);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;

        img.onload = () => {
            // Create a hidden canvas in memory
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Shrink it exactly to the number of beads that fit on the screen
            canvas.width = columnas;
            canvas.height = filas;

            if (ctx) {
                // Draw the stretched/adapted image to the grid
                ctx.drawImage(img, 0, 0, columnas, filas);

                // Read the original color info from the image
                const imgData = ctx.getImageData(0, 0, columnas, filas).data;
                const nuevasPosiciones = [];

                // Traverse the grid pixel by pixel
                for (let f = 0; f < filas; f++) {
                    for (let c = 0; c < columnas; c++) {
                        // Each pixel takes up 4 positions in the array (R, G, B, A)
                        const index = (f * columnas + c) * 4;
                        const r = imgData[index] / 255;
                        const g = imgData[index + 1] / 255;
                        const b = imgData[index + 2] / 255;

                        nuevasPosiciones.push({
                            columna: c,
                            fila: f,
                            color: [r, g, b]
                        });
                    }
                }
                setPixelData(nuevasPosiciones);
            }
            setIsLoading(false);
        };

        img.onerror = () => {
            console.error("Error loading the image in the kitsch curtain.");
            setIsLoading(false);
        };
    }, []);

    return { pixelData, parseImage, isLoading };
}