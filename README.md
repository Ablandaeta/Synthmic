# Synthmic - A D&D Mimic Synthesizer

Un sintetizador web tematizado como un **Mimic** (imitador) del Dungeons & Dragons, creado para aprender cómo funciona el audio en navegadores. Construido con **React**, **Vite** y **Bun**.

## 🎹 Características

- **Teclado Sintetizador**: 13 teclas (octava completa con sostenidos)
- **Osciladores**: Generación de ondas de audio (sawtooth, sine, square, triangle)
- **Control ADSR**: Attack, Decay, Sustain, Release para moldeamiento de sonido
- **UI Tematizada**: Diseño visual inspirado en un Mimic del D&D
- **Aprendizaje Interactivo**: Código fuente educativo sobre Web Audio API

## 🛠 Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Runtime**: Bun
- **Audio**: Web Audio API
- **Linting**: ESLint + TypeScript ESLint

## 📦 Instalación

```bash
# Clonar o descargar el proyecto
cd Synthmic

# Instalar dependencias con Bun
bun install
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo local con HMR
bun run dev

# Compilar para producción
bun run build

# Vista previa de la build
bun run preview

# Linting de código
bun run lint
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/          # Componentes reutilizables (Key, Knob, Display)
│   ├── modules/        # Módulos funcionales (Keyboard, OscillatorModule, MasterModule)
│   └── layout/         # Layout principal (SynthChassis)
├── audio/
│   ├── AudioEngine.ts  # Motor de síntesis de audio
│   ├── Oscillators.ts  # Generadores de ondas
│   └── ADSR.ts         # Envolvente ADSR
├── data/
│   └── note.ts         # Frecuencias de notas musicales
├── hooks/
│   ├── useAudio.ts     # Hook para contexto de audio
│   └── useKeyboard.ts  # Hook para inputs de teclado
├── types/              # Tipos TypeScript compartidos
└── main.tsx            # Punto de entrada
```

## 🎮 Cómo Usar

1. Inicia el servidor de desarrollo: `bun run dev`
2. Abre http://localhost:5173
3. **Presiona las teclas del teclado** para tocar notas
4. Ajusta los **controles** (Knobs) para modificar:
   - Oscilador (forma de onda)
   - ADSR (envolvente de sonido)
   - Volumen y efectos

## 🎵 Características de Audio

### Osciladores Soportados
- Sawtooth (diente de sierra)
- Sine (sinusoide)
- Square (onda cuadrada)
- Triangle (triangular)

### Envolvente ADSR
- **Attack**: Tiempo para alcanzar volumen máximo
- **Decay**: Tiempo para caer al nivel de sustain
- **Sustain**: Nivel de volumen sostenido
- **Release**: Tiempo para silenciar después de soltar la tecla

## 📚 Propósito Educativo

Este proyecto es ideal para aprender:
- ✅ Web Audio API fundamentals
- ✅ Síntesis de audio básica
- ✅ Osciladores y envolventes
- ✅ React hooks CustomHooks
- ✅ TypeScript avanzado
- ✅ Gestión de estado en aplicaciones de audio

## 🏗️ Principios de Desarrollo

El código sigue principios **SOLID** y buenas prácticas de desarrollo:

- **S**ingle Responsibility: Cada componente tiene una única responsabilidad
- **O**pen/Closed: Abierto a extensión, cerrado a modificación
- **L**iskov Substitution: Componentes intercambiables
- **I**nterface Segregation: Interfaces específicas, no genéricas
- **D**ependency Inversion: Inversión de dependencias con hooks y contexto

Además:
- Estructura de carpetas por feature/tipo
- Separación de lógica (audio, hooks, componentes)
- Tipado fuerte con TypeScript
- Alias de importación para código más limpio
- Nomenclatura consistente

## ⚙️ Configuración de Alias

El proyecto usa alias de importación para código más limpio:

```typescript
import { Note } from '@/data/note';
import { Key } from '@/components/atoms/Key';
import { synth } from '@/audio/AudioEngine';
```

Configurado en `tsconfig.app.json` y `vite.config.ts`

## 🐛 Desarrollo

Para añadir nuevas características:

1. Crea componentes en `src/components/`
2. Lógica de audio en `src/audio/`
3. Tipos en `src/types/index.ts`
4. Ejecuta `bun run lint` antes de commitear

## 📝 Licencia

Este proyecto es de código abierto para propósitos educativos.

---

**Hecho con 🎵 y 🦁 (Mimic power!)**
