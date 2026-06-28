// Dynamic retro/kitsch image generator using Canvas 2D

export const PRESETS = [
    {
        id: 'default',
        name: 'Cortina Rayada Clásica',
        description: 'Patrón a rayas retro verde, rojo y manteca con zócalo verde.',
        generate: () => {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            if (!ctx) return '';

            // Dark base background
            ctx.fillStyle = '#05020c';
            ctx.fillRect(0, 0, 300, 400);

            const numCols = 32; // Virtual grid of 32 columns for the canvas render
            const colWidth = 300 / numCols;


            const stripeColors = [
                '#0d7625ff', '#0d7625ff',
                '#1a1a1aff', '#1a1a1aff',
                '#0d7625ff', '#0d7625ff',
                '#1a1a1aff', '#1a1a1aff'
            ];

            for (let c = 0; c < numCols; c++) {
                const color = stripeColors[c % stripeColors.length];
                ctx.fillStyle = color;
                ctx.fillRect(c * colWidth, 0, colWidth, 400);
            }

            // Around 10-12% of the total height
            ctx.fillStyle = '#d8dcd9ff';
            ctx.fillRect(0, 350, 300, 50);

            return canvas.toDataURL('image/jpeg');
        }
    }
];

export const getPresetImageById = (id) => {
    const preset = PRESETS.find(p => p.id === id);
    return preset ? preset.generate() : PRESETS[0].generate();
};

export const generateCustomPattern = (color1, color2, colorZocalo) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Base background
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 300, 400);

    const numCols = 32;
    const colWidth = 300 / numCols;

    // 2 by 2 pattern
    const stripeColors = [color1, color1, color2, color2];

    for (let c = 0; c < numCols; c++) {
        const color = stripeColors[c % stripeColors.length];
        ctx.fillStyle = color;
        ctx.fillRect(c * colWidth, 0, colWidth, 400);
    }

    // Bottom plinth
    ctx.fillStyle = colorZocalo;
    ctx.fillRect(0, 350, 300, 50);

    return canvas.toDataURL('image/jpeg');
};
