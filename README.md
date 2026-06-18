# Synthmic - A D&D Mimic Synthesizer

![Synthmic Concept](./public/SynthmicConcept.png)

Un sintetizador web tematizado como un **Mimic** (imitador) del Dungeons & Dragons, creado para aprender cómo funciona el audio en navegadores. Construido con **React 19**, **Vite 7**, **TypeScript** y **pnpm**.

## 🎹 Características

- **Teclado Sintetizador**: 13 teclas (octava completa con sostenidos)
- **Osciladores**: Generación de ondas de audio (sawtooth, sine, square, triangle)
- **Control ADSR**: Attack, Decay, Sustain, Release para moldeamiento de sonido
- **Glissando**: Deslizamiento monofónico entre notas con control de velocidad
- **Ecualizador**: EQ de 6 bandas con control independiente
- **UI Tematizada**: Diseño visual inspirado en un Mimic del D&D
- **Aprendizaje Interactivo**: Código fuente educativo sobre Web Audio API

## 🛠 Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Package Manager**: pnpm
- **Testing**: Vitest + React Testing Library + jsdom
- **Audio**: Web Audio API
- **Linting**: ESLint + TypeScript ESLint

## 📦 Instalación

```bash
# Clonar o descargar el proyecto
cd Synthmic

# Instalar dependencias con pnpm
pnpm install
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo local con HMR
pnpm dev

# Compilar para producción
pnpm build

# Vista previa de la build
pnpm preview

# Ejecutar tests
pnpm test

# Linting de código
pnpm lint
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/          # Componentes reutilizables (Key, Knob, Display)
|   |   └──component/       # Componente genérico para atoms
|   |       ├── index.tsx          # exportar el componente
|   |       ├── style.css          # estilos del componente
|   |       ├── component.tsx      # componente en si
|   |       └── component.test.tsx # test del componente
|   |
│   ├── modules/        # Módulos funcionales (Keyboard, WaveformSelector, EnvelopeControl, EqModule, Wheels)
│   └── layout/         # Layout principal (SynthChassis, Rack, ModulePanel)
├── audio/
│   ├── AudioEngine.ts  # Motor de síntesis de audio
│   ├── Oscillator.ts   # Generadores de ondas con envolvente ADSR
│   ├── LFO.ts          # Oscilador de baja frecuencia
│   ├── EQ.ts           # Ecualizador de 6 bandas
│   └── *.test.ts       # Tests unitarios
├── context/
│   ├── SynthContext.tsx # Contexto React para el motor de audio
│   └── SynthProvider.tsx# Proveedor del contexto
├── data/
│   └── note.ts         # Frecuencias de notas musicales
├── hooks/
│   ├── useSynth.ts     # Hook para acceder al contexto de audio
│   ├── useKeyboard.ts  # Hook para inputs de teclado
│   ├── useDragControl.ts # Hook para interacciones de arrastre
│   └── useHover.ts     # Hook para detección de hover
├── types/              # Tipos TypeScript compartidos
└── main.tsx            # Punto de entrada
```

## 🎮 Cómo Usar

1. Inicia el servidor de desarrollo: `pnpm dev`
2. Abre http://localhost:5173
3. **Presiona las teclas del teclado** para tocar notas
4. Ajusta los **controles** (Knobs) para modificar:
   - Oscilador (forma de onda)
   - ADSR (envolvente de sonido)
   - Glissando (deslizamiento entre notas)
   - EQ (ecualización de 6 bandas)
   - Volumen y modulación

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

### Glissando
- Control de velocidad de deslizamiento entre notas
- Gateo monofónico (legato)
- Desactivación por nota (retrigger)

### Ecualizador
- 6 bandas de frecuencia ajustables
- Filtros en cascada para modelado espectral

## 📚 Propósito Educativo

Este proyecto es ideal para aprender:
- ✅ Web Audio API fundamentals
- ✅ Síntesis de audio básica
- ✅ Osciladores y envolventes
- ✅ React hooks y Custom Hooks
- ✅ TypeScript avanzado
- ✅ Gestión de estado en aplicaciones de audio
- ✅ Patrones de composición en React
- ✅ Testing con Vitest y Testing Library

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
- Tests unitarios para componentes y lógica de audio

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
4. Añade tests en `*.test.ts` junto al archivo
5. Ejecuta `pnpm lint` y `pnpm test` antes de commitear

## 🔄 Migración

Este proyecto migró de **Bun** a **pnpm** como package manager para mejorar la gestión de dependencias y el rendimiento en CI/CD.

```bash
# Si venías usando Bun, cambia a pnpm:
pnpm install    # Reemplaza bun install
pnpm dev        # Reemplaza bun run dev
```

## 📝 Licencia

Este proyecto es de código abierto para propósitos educativos.

---

**Hecho con 🎵 y 🦁 (Mimic power!)**
