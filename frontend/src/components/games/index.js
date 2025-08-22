// Exportar todos los mini-juegos STEM
export { default as NumberPuzzle } from './NumberPuzzle';
export { default as GreenInvention } from './GreenInvention';
export { default as BrokenBridge } from './BrokenBridge';
export { default as SpaceExplorer } from './SpaceExplorer';
export { default as GameContainer } from './GameContainer';

// Información de los juegos para el sistema
export const STEM_GAMES = [
  {
    id: 'number_puzzle',
    name: 'Puzzle de Números',
    description: 'Descubre patrones matemáticos en secuencias numéricas',
    category: 'matemáticas',
    duration: 180, // segundos
    difficulty: 'intermedio',
    skills: ['Razonamiento lógico', 'Patrones matemáticos', 'Velocidad de resolución'],
    stemAreas: ['matemáticas'],
    targetAudience: 'estudiantes_secundaria',
    learningObjectives: [
      'Identificar patrones aritméticos y geométricos',
      'Desarrollar razonamiento secuencial',
      'Mejorar velocidad de cálculo mental'
    ]
  },
  {
    id: 'green_invention',
    name: 'Invento Verde',
    description: 'Diseña soluciones ambientales innovadoras',
    category: 'ingeniería',
    duration: 180,
    difficulty: 'avanzado',
    skills: ['Creatividad aplicada', 'Pensamiento ingenieril', 'Sostenibilidad'],
    stemAreas: ['ingeniería', 'ciencia'],
    targetAudience: 'estudiantes_secundaria',
    learningObjectives: [
      'Aplicar principios de ingeniería sostenible',
      'Evaluar eficiencia de materiales',
      'Diseñar soluciones ambientales'
    ]
  },
  {
    id: 'broken_bridge',
    name: 'El Puente Roto',
    description: 'Resuelve desafíos de ingeniería civil',
    category: 'ingeniería',
    duration: 180,
    difficulty: 'intermedio',
    skills: ['Resolución de problemas', 'Análisis de restricciones', 'Toma de decisiones'],
    stemAreas: ['ingeniería', 'matemáticas'],
    targetAudience: 'estudiantes_secundaria',
    learningObjectives: [
      'Analizar restricciones de proyectos',
      'Evaluar múltiples soluciones',
      'Tomar decisiones técnicas informadas'
    ]
  },
  {
    id: 'space_explorer',
    name: 'Exploradora Espacial',
    description: 'Diseña misiones espaciales con restricciones técnicas',
    category: 'tecnología',
    duration: 180,
    difficulty: 'avanzado',
    skills: ['Afinidad tecnológica', 'Ciencias exactas', 'Optimización de sistemas'],
    stemAreas: ['tecnología', 'ciencia', 'ingeniería'],
    targetAudience: 'estudiantes_secundaria',
    learningObjectives: [
      'Comprender restricciones de sistemas espaciales',
      'Optimizar diseños técnicos',
      'Aplicar principios de ingeniería de sistemas'
    ]
  }
];

// Función para obtener información de un juego por ID
export const getGameInfo = (gameId) => {
  return STEM_GAMES.find(game => game.id === gameId);
};

// Función para obtener juegos por categoría STEM
export const getGamesByCategory = (category) => {
  return STEM_GAMES.filter(game => game.stemAreas.includes(category));
};

// Función para obtener juegos por dificultad
export const getGamesByDifficulty = (difficulty) => {
  return STEM_GAMES.filter(game => game.difficulty === difficulty);
};
