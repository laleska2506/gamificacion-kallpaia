# KallpaIA - Plataforma Gamificada STEM

## 🌟 Descripción

KallpaIA es una plataforma gamificada diseñada para inspirar a mujeres jóvenes en carreras STEM (Ciencia, Tecnología, Ingeniería y Matemáticas) a través de una experiencia espacial inmersiva. La plataforma utiliza mini-juegos interactivos para evaluar afinidades y recomendar carreras STEM de manera personalizada.

## 🚀 Características Principales

### ✨ Experiencia Espacial
- **Tema galáctico** con efectos visuales inmersivos
- **Planetas STEM** únicos con colores característicos
- **Partículas flotantes** y efectos de brillo dinámicos
- **Glassmorphism** moderno en toda la interfaz

### 🎮 Mini-Juegos Interactivos
1. **Puzzle de Números** (Matemáticas) - Secuencias lógicas y patrones
2. **Invento Verde** (Ingeniería) - Soluciones ambientales innovadoras  
3. **El Puente Roto** (Ingeniería) - Construcción y estructuras
4. **Exploradora Espacial** (Tecnología) - Misiones espaciales técnicas

### 📊 Sistema de Evaluación
- **Cálculo de afinidades STEM** basado en rendimiento
- **Recomendaciones personalizadas** de carreras
- **Sistema de ranking cooperativo** galáctico
- **Progreso anónimo** sin recopilación de datos personales

### 🏆 Gamificación Completa
- **Sistema de puntos** y recompensas
- **Logros desbloqueables** (Constelaciones)
- **Misiones espaciales** por dificultad
- **Certificaciones galácticas** por nivel

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal
- **Vite** - Build tool y desarrollo
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones fluidas
- **React Router DOM** - Navegación SPA
- **Axios** - Cliente HTTP
- **Lucide React** - Iconografía

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **UUID** - Identificadores únicos para sesiones

### Base de Datos
```sql
- sessions (gestión de usuarios anónimos)
- games (catálogo de mini-juegos)
- game_events (historial de partidas)
- stem_affinities (cálculos de afinidad)
- stem_planets (información de planetas)
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone https://github.com/laleska2506/gamificacion-kallpaia.git
cd gamificacion-kallpaia
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kallpaia_db
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3000
```

Ejecutar migraciones de base de datos:
```bash
npm run migrate
```

Iniciar servidor backend:
```bash
npm start
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
```

Iniciar servidor de desarrollo:
```bash
npm run dev
```

## 🎯 Uso de la Plataforma

### Para Usuarios
1. **Acceder** a http://localhost:5173
2. **Explorar** la galaxia STEM
3. **Completar** los 4 mini-juegos
4. **Descubrir** tu planeta STEM ideal
5. **Explorar** recursos y misiones del planeta

### Flujo de Usuario
```
Página Principal → Selección de Juegos → Mini-Juegos (x4) → 
Perfil STEM → Planeta Recomendado → Exploración del Planeta
```

## 🏗️ Arquitectura del Sistema

### Frontend (React SPA)
```
src/
├── components/
│   ├── games/          # Mini-juegos interactivos
│   └── ui/             # Componentes reutilizables
├── contexts/           # Context API (Estado global)
├── pages/              # Páginas principales
└── styles/             # Estilos CSS personalizados
```

### Backend (Express API)
```
backend/
├── routes/             # Endpoints API
├── config/             # Configuración de BD
├── middleware/         # Middlewares personalizados
└── utils/              # Utilidades compartidas
```

## 🎨 Sistema de Diseño

### Colores por Planeta
- **Matemáticas**: Amarillo dorado (#FBBF24)
- **Ingeniería**: Naranja ingenieril (#EA580C)
- **Tecnología**: Cian tecnológico (#06B6D4)
- **Ciencia**: Verde científico (#10B981)

### Efectos Visuales
- **Glassmorphism**: `backdrop-blur-lg` con transparencias
- **Gradientes animados**: Transiciones suaves de color
- **Partículas flotantes**: Animaciones CSS personalizadas
- **Efectos de brillo**: `box-shadow` con colores del planeta

## 🔒 Privacidad y Seguridad

- **Anonimato completo**: Solo se usa `session_id` UUID
- **Sin datos personales**: No se recopila información identificable
- **Sesiones temporales**: Datos almacenados localmente
- **Transparencia total**: Código abierto y auditable

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl de Tailwind CSS
- **Touch Friendly**: Botones y elementos táctiles
- **Performance**: Optimizado para dispositivos de gama baja

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollado por**: Equipo WIE-KALLPA
- **Contacto**: [laleska2506](https://github.com/laleska2506)

## 🌟 Agradecimientos

- Inspirado en la misión de empoderar mujeres en STEM
- Agradecimientos a la comunidad open source
- Diseño inspirado en la vastedad del cosmos

---

**¡Explora tu potencial en el universo STEM! 🚀✨**