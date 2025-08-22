# 🎮 Mini-Juegos STEM - KallpaIA

## Descripción General

Los mini-juegos STEM son la piedra angular de KallpaIA, diseñados para evaluar las habilidades y afinidades de los usuarios en diferentes áreas de Ciencia, Tecnología, Ingeniería y Matemáticas. Cada juego está cuidadosamente diseñado para ser educativo, divertido y evaluativo.

## 🎯 Objetivos de los Mini-Juegos

### 1. **Evaluación de Habilidades STEM**
- Identificar fortalezas en áreas específicas
- Medir capacidad de resolución de problemas
- Evaluar pensamiento crítico y creativo
- Determinar afinidades vocacionales

### 2. **Experiencia de Usuario**
- Juegos de 2-3 minutos para mantener el interés
- Interfaz intuitiva y atractiva
- Feedback inmediato y constructivo
- Progresión de dificultad gradual

### 3. **Recopilación de Datos**
- Puntuaciones basadas en rendimiento
- Tiempo de resolución
- Estrategias utilizadas
- Uso de pistas y reintentos

## 🎮 Juegos Implementados

### 1. **Puzzle de Números** 🔢
**Categoría:** Matemáticas  
**Duración:** 3 minutos  
**Dificultad:** Intermedio  

**Descripción:** Los usuarios deben identificar patrones matemáticos en secuencias numéricas, incluyendo progresiones aritméticas, geométricas y la secuencia de Fibonacci.

**Habilidades Evaluadas:**
- Razonamiento lógico
- Identificación de patrones
- Velocidad de resolución
- Precisión matemática

**Mecánicas:**
- 3 niveles de dificultad creciente
- Secuencias generadas dinámicamente
- Sistema de pistas (3 disponibles)
- Puntuación basada en tiempo y precisión

### 2. **Invento Verde** 🌱
**Categoría:** Ingeniería  
**Duración:** 3 minutos  
**Dificultad:** Avanzado  

**Descripción:** Los usuarios diseñan soluciones ambientales seleccionando materiales con diferentes características de eficiencia, costo y sostenibilidad.

**Habilidades Evaluadas:**
- Creatividad aplicada
- Pensamiento ingenieril
- Análisis de restricciones
- Conciencia ambiental

**Mecánicas:**
- 3 desafíos ambientales diferentes
- Selección de materiales con restricciones
- Evaluación de eficiencia y costo
- Puntuación basada en optimización

### 3. **El Puente Roto** 🌉
**Categoría:** Ingeniería  
**Duración:** 3 minutos  
**Dificultad:** Intermedio  

**Descripción:** Los usuarios resuelven problemas de ingeniería civil analizando restricciones y evaluando múltiples soluciones técnicas.

**Habilidades Evaluadas:**
- Resolución de problemas
- Análisis de restricciones
- Toma de decisiones técnicas
- Evaluación de alternativas

**Mecánicas:**
- 3 escenarios de ingeniería
- Múltiples soluciones con pros y contras
- Restricciones de presupuesto y tiempo
- Puntuación basada en decisiones óptimas

### 4. **Exploradora Espacial** 🚀
**Categoría:** Tecnología  
**Duración:** 3 minutos  
**Dificultad:** Avanzado  

**Descripción:** Los usuarios diseñan misiones espaciales seleccionando componentes técnicos que cumplan con restricciones de potencia, peso y presupuesto.

**Habilidades Evaluadas:**
- Afinidad tecnológica
- Ciencias exactas
- Optimización de sistemas
- Pensamiento sistémico

**Mecánicas:**
- 3 misiones espaciales diferentes
- Selección de componentes técnicos
- Restricciones múltiples (potencia, peso, costo)
- Puntuación basada en componentes óptimos

## 📊 Sistema de Puntuación

### **Fórmula Base:**
```
Puntuación = Puntuación Base + Bonus de Tiempo - Penalizaciones
```

### **Componentes de Puntuación:**
1. **Puntuación Base:** 100 puntos por nivel/misión completada
2. **Bonus de Tiempo:** Hasta 30 puntos por velocidad
3. **Bonus de Eficiencia:** Hasta 20 puntos por optimización
4. **Bonus de Precisión:** Hasta 50 puntos por decisiones óptimas

### **Penalizaciones:**
- **Uso de Pistas:** -10 puntos por pista utilizada
- **Reintentos:** -5 puntos por intento adicional
- **Tiempo Excesivo:** Penalización gradual después de 2 minutos

## 🔧 Arquitectura Técnica

### **Estructura de Componentes:**
```
src/components/games/
├── GameContainer.jsx      # Contenedor principal
├── NumberPuzzle.jsx       # Juego de patrones matemáticos
├── GreenInvention.jsx     # Juego de inventos ambientales
├── BrokenBridge.jsx       # Juego de resolución de problemas
├── SpaceExplorer.jsx      # Juego de misiones espaciales
├── index.js               # Exportaciones y metadatos
└── README.md              # Esta documentación
```

### **Estados del Juego:**
- `ready`: Pantalla de instrucciones
- `playing`: Juego en progreso
- `paused`: Juego pausado
- `completed`: Juego finalizado

### **Props de los Juegos:**
- `onGameComplete(results)`: Callback cuando se completa el juego
- `onGameStart()`: Callback cuando inicia el juego

## 📈 Datos Recopilados

### **Métricas de Rendimiento:**
- Puntuación final
- Tiempo total de juego
- Niveles/misiones completados
- Pistas utilizadas
- Reintentos realizados

### **Datos de Interacción:**
- Secuencias de números seleccionadas
- Materiales elegidos
- Soluciones seleccionadas
- Componentes técnicos utilizados

### **Análisis de Habilidades:**
- Fortalezas en áreas STEM específicas
- Patrones de resolución de problemas
- Estrategias preferidas
- Áreas de mejora identificadas

## 🎨 Personalización y Temas

### **Colores por Categoría STEM:**
- **Matemáticas:** `stem-math-*` (azules)
- **Ciencia:** `stem-science-*` (verdes)
- **Tecnología:** `stem-tech-*` (púrpuras)
- **Ingeniería:** `stem-engineering-*` (naranjas)

### **Gradientes de Fondo:**
- Cada juego tiene su propio tema de color
- Transiciones suaves entre estados
- Efectos visuales responsivos

## 🚀 Futuras Mejoras

### **Funcionalidades Planificadas:**
1. **Modo Multijugador:** Competencia entre usuarios
2. **Logros y Badges:** Sistema de recompensas
3. **Progresión Personalizada:** Dificultad adaptativa
4. **Analytics Avanzados:** Métricas detalladas de rendimiento
5. **Integración con IA:** Recomendaciones personalizadas

### **Optimizaciones Técnicas:**
1. **Lazy Loading:** Carga bajo demanda de juegos
2. **Caching:** Almacenamiento de resultados
3. **Offline Support:** Juegos sin conexión
4. **Progressive Web App:** Instalación como app nativa

## 📚 Recursos Adicionales

### **Documentación Relacionada:**
- [README Principal](../../../README.md)
- [API Endpoints](../../../backend/README.md)
- [Base de Datos](../../../backend/scripts/setup-database.js)

### **Herramientas de Desarrollo:**
- **React 18:** Framework principal
- **Framer Motion:** Animaciones
- **Tailwind CSS:** Estilos
- **Lucide React:** Iconos

### **Testing:**
- **Jest:** Testing unitario
- **React Testing Library:** Testing de componentes
- **Cypress:** Testing end-to-end

---

**Desarrollado con ❤️ para inspirar el futuro de las mujeres en STEM**
