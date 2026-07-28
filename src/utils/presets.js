// Dynamic retro/kitsch image generator using Canvas 2D

export const PRESETS = [
    {
        id: 'default',
        name: 'Cortina Rayada Clásica',
        description: 'Patrón a rayas retro verde, rojo y manteca con zócalo verde.',
        generate: (orientation = 'vertical') => {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            if (!ctx) return '';

            // Dark base background
            ctx.fillStyle = '#05020c';
            ctx.fillRect(0, 0, 300, 400);

            const stripeColors = [
                '#0d7625ff', '#0d7625ff',
                '#1a1a1aff', '#1a1a1aff',
                '#0d7625ff', '#0d7625ff',
                '#1a1a1aff', '#1a1a1aff'
            ];

            if (orientation === 'vertical') {
                const numCols = 32; // Virtual grid of 32 columns for the canvas render
                const colWidth = 300 / numCols;
                for (let c = 0; c < numCols; c++) {
                    const color = stripeColors[c % stripeColors.length];
                    ctx.fillStyle = color;
                    ctx.fillRect(c * colWidth, 0, colWidth, 400);
                }
            } else {
                const numRows = 24; // Virtual grid of 24 rows for the canvas render
                const rowHeight = 350 / numRows;
                for (let r = 0; r < numRows; r++) {
                    const color = stripeColors[r % stripeColors.length];
                    ctx.fillStyle = color;
                    ctx.fillRect(0, r * rowHeight, 300, rowHeight);
                }
            }

            // Around 10-12% of the total height
            ctx.fillStyle = '#d8dcd9ff';
            ctx.fillRect(0, 350, 300, 50);

            return canvas.toDataURL('image/jpeg');
        }
    }
];

export const getPresetImageById = (id, orientation = 'vertical') => {
    const preset = PRESETS.find(p => p.id === id);
    return preset ? preset.generate(orientation) : PRESETS[0].generate(orientation);
};

export const generateCustomPattern = (color1, color2, colorZocalo, orientation = 'vertical') => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Base background
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 300, 400);

    if (orientation === 'vertical') {
        const numCols = 32;
        const colWidth = 300 / numCols;
        // 2 by 2 pattern
        const stripeColors = [color1, color1, color2, color2];

        for (let c = 0; c < numCols; c++) {
            const color = stripeColors[c % stripeColors.length];
            ctx.fillStyle = color;
            ctx.fillRect(c * colWidth, 0, colWidth, 400);
        }
    } else {
        const numRows = 24;
        const rowHeight = 350 / numRows;
        // 2 by 2 pattern
        const stripeColors = [color1, color1, color2, color2];

        for (let r = 0; r < numRows; r++) {
            const color = stripeColors[r % stripeColors.length];
            ctx.fillStyle = color;
            ctx.fillRect(0, r * rowHeight, 300, rowHeight);
        }
    }

    // Bottom plinth
    ctx.fillStyle = colorZocalo;
    ctx.fillRect(0, 350, 300, 50);

    return canvas.toDataURL('image/jpeg');
};

export const generateGridPattern = (columns, rows, color1, color2, colorZocalo, orientation = 'vertical') => {
    const canvas = document.createElement('canvas');
    canvas.width = columns;
    canvas.height = rows;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Base background
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, columns, rows);

    const zocaloRows = Math.ceil(rows * 0.125);
    const patternRows = rows - zocaloRows;

    // 2 by 2 pattern
    const stripeColors = [color1, color1, color2, color2];

    if (orientation === 'vertical') {
        for (let c = 0; c < columns; c++) {
            const color = stripeColors[Math.floor(c / 2) % stripeColors.length];
            ctx.fillStyle = color;
            ctx.fillRect(c, 0, 1, rows);
        }
    } else {
        for (let r = 0; r < patternRows; r++) {
            const color = stripeColors[Math.floor(r / 2) % stripeColors.length];
            ctx.fillStyle = color;
            ctx.fillRect(0, r, columns, 1);
        }
    }

    // Bottom plinth (zócalo)
    ctx.fillStyle = colorZocalo;
    ctx.fillRect(0, patternRows, columns, zocaloRows);

    return canvas.toDataURL('image/png');
};


