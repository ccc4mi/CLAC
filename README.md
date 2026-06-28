# CLAC!

*Inspirado en las típicas cortinas plásticas de los almacenes de barrio / Inspired by the classic plastic strip curtains of neighborhood grocery stores.*

[**Español**](#español) | [**English**](#english)

---

<a name="español"></a>
## Español

**CLAC!** es un juguete visual interactivo diseñado para deformar, re-enhebrar y customizar. Pasa el ratón (o el dedo), sacude los eslabones plásticos y haz ruido. Está desarrollado con físicas 3D en tiempo real para lograr la sensación exacta del roce y la inercia de una cortina real.

### Características
- **Físicas Reactivas (PBD):** Simulación de colisiones, gravedad, inercia y rebotes en tiempo real a 60 FPS.
- **Interacción Sonora:** Generación procedural de audio (con osciladores web) que imita el sonido "clac-clac" del plástico chocando según la fuerza del empuje.
- **Máscaras Personalizables:** Arrastra y suelta cualquier imagen (Drag & Drop) y el motor adaptará los colores de los eslabones a los píxeles de tu imagen.
- **Paleta de Colores Dinámica:** Personaliza los colores de las rayas clásicas y del zócalo inferior utilizando selectores de color integrados.
- **Captura de Pantalla:** Descarga un `.png` de alta resolución de tu creación directamente desde la interfaz.
- **Totalmente Seguro y Local:** Todo el procesamiento de las imágenes ocurre localmente en tu navegador sin interactuar con bases de datos externas ni servidores.

---

<a name="english"></a>
## English

**CLAC!** is an interactive visual toy designed to deform, re-thread, and customize. Swipe your mouse (or finger), shake the plastic beads, and make some noise. It is built with real-time 3D physics to replicate the exact friction and inertia of a real strip curtain.

### Features
- **Reactive Physics (PBD):** Real-time simulation of collisions, gravity, inertia, and bouncing at 60 FPS.
- **Sound Interaction:** Procedural audio generation (using web oscillators) that mimics the "clac-clac" sound of plastic beads clashing, reacting to the force of your swipe.
- **Custom Masks:** Drag & drop any image, and the engine will adapt the colors of the beads to match the pixels of your picture.
- **Dynamic Color Palette:** Customize the colors of the classic stripes and the bottom plinth using built-in color pickers.
- **Screenshot Export:** Download a high-resolution `.png` of your creation directly from the UI.
- **Fully Secure & Local:** All image processing happens locally inside your browser without interacting with external databases or servers.

---

## Tech Stack

- **React 19**
- **Three.js** & **@react-three/fiber** (3D Rendering)
- **@react-three/drei** (InstancedMesh optimizations)
- **Vite** (Build Tool)
- **Lucide React** (Icons)

## Quick Start (Local Development)

1. Clone the repository / Clona el repositorio:
   ```bash
   git clone https://github.com/yourusername/clac.git
   cd clac
   ```

2. Install dependencies / Instala las dependencias:
   ```bash
   npm install
   ```

3. Run the development server / Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to / Abre tu navegador y dirígete a:
   `http://localhost:5173`

## Deployment on Vercel

This project is fully optimized for Vercel deployment. 
Este proyecto está completamente optimizado para desplegarse en Vercel.

1. Create a new project in Vercel.
2. Link your GitHub repository.
3. Vercel will automatically detect **Vite** and configure the build settings (`npm run build` and `dist` directory).
4. Click **Deploy**.

## Credits

2026 **CLAC!** made by **ccc4.mi**
