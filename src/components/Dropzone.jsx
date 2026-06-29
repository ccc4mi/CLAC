import React, { useCallback, useRef } from 'react';
import { useCurtain } from '../context/CurtainContext';

export function Dropzone() {
    const { setCurrentImage, isLoading } = useCurtain();
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        processFile(file);
    }, [setCurrentImage]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setCurrentImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="dropzone-container"
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }}
            />
            {isLoading ? (
                <div className="status-loading">
                    <span className="loading-spinner"></span>
                </div>
            ) : (
                <div className="dropzone-content">
                    <span>Soltar imagen o hacer click</span>
                </div>
            )}
        </div>
    );
}