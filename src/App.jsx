import React, { useState } from 'react';
import { CurtainProvider, useCurtain } from './context/CurtainContext';
import { Scene } from './webgl/Scene';
import { Dropzone } from './components/Dropzone';
import { getPresetImageById, generateCustomPattern } from './utils/presets';

function AppContent() {
    const {
        pixelData,
        currentImage,
        setCurrentImage,
        isLoading
    } = useCurtain();

    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const [color1, setColor1] = useState('#0d7625');
    const [color2, setColor2] = useState('#1a1a1a');
    const [color3, setColor3] = useState('#d8dcd9');

    const handleReset = () => {
        setColor1('#0d7625');
        setColor2('#1a1a1a');
        setColor3('#d8dcd9');
        setCurrentImage(getPresetImageById('default'));
    };

    const handleColorChange = (c1, c2, c3) => {
        setColor1(c1);
        setColor2(c2);
        setColor3(c3);
        setCurrentImage(generateCustomPattern(c1, c2, c3));
    };

    const handleDownload = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'clac_cortina.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <>
            <Scene pixelData={pixelData} />

            {!isPanelOpen && (
                <button
                    onClick={() => setIsPanelOpen(true)}
                    className="toggle-panel-btn"
                    title="Abrir Panel"
                >
                    CLAC!
                </button>
            )}

            {isPanelOpen && (
                <div className="sidebar-panel">
                    <div className="panel-header">
                        <h2 className="panel-title">CLAC!</h2>
                        <button
                            className="close-btn"
                            onClick={() => setIsPanelOpen(false)}
                        >
                            X
                        </button>
                    </div>

                    <div>
                        <div className="section-title">Cambiar máscara</div>
                        <Dropzone />
                        <div style={{ height: '12px' }}></div>
                        <button className="btn-secondary" onClick={handleReset}>
                            Revertir a rayado clásico
                        </button>
                    </div>

                    <div>
                        <div className="section-title">Colores (Rayas y Zócalo)</div>
                        <div className="colors-row">
                            <label 
                                className="color-circle" 
                                style={{ backgroundColor: color1, overflow: 'hidden', position: 'relative' }} 
                            >
                                <input 
                                    type="color" 
                                    value={color1} 
                                    onChange={(e) => handleColorChange(e.target.value, color2, color3)} 
                                    style={{ opacity: 0, width: '200%', height: '200%', cursor: 'pointer', position: 'absolute', top: '-50%', left: '-50%' }}
                                />
                            </label>
                            <label 
                                className="color-circle" 
                                style={{ backgroundColor: color2, overflow: 'hidden', position: 'relative' }} 
                            >
                                <input 
                                    type="color" 
                                    value={color2} 
                                    onChange={(e) => handleColorChange(color1, e.target.value, color3)} 
                                    style={{ opacity: 0, width: '200%', height: '200%', cursor: 'pointer', position: 'absolute', top: '-50%', left: '-50%' }}
                                />
                            </label>
                            <label 
                                className="color-circle" 
                                style={{ backgroundColor: color3, overflow: 'hidden', position: 'relative' }} 
                            >
                                <input 
                                    type="color" 
                                    value={color3} 
                                    onChange={(e) => handleColorChange(color1, color2, e.target.value)} 
                                    style={{ opacity: 0, width: '200%', height: '200%', cursor: 'pointer', position: 'absolute', top: '-50%', left: '-50%' }}
                                />
                            </label>
                        </div>
                    </div>

                    <button className="btn-secondary" onClick={handleDownload}>
                        ↓ Descargar cortina
                    </button>

                    <div>
                        <h3 className="about-title">Sobre CLAC!</h3>
                        <p className="about-text">
                            Inspirado en las típicas cortinas plásticas de los almacenes de barrio,
                            CLAC! es un juguete visual interactivo diseñado para deformar,
                            re-enhebrar y customizar. Pasá, sacudí los eslabones y hacé ruido.
                        </p>
                        <div className="footer-text">
                            2026 CLAC! made by <strong>ccc4.mi</strong>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function App() {
    return (
        <CurtainProvider>
            <AppContent />
        </CurtainProvider>
    );
}
