import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '../contexts/SessionContext';
import { useAffinity } from '../contexts/AffinityContext';
import { useCooperativeRanking } from '../contexts/CooperativeRankingContext';
import StemProfileModal from '../components/StemProfileModal';
import GameContainer from '../components/games/GameContainer';
import {
  Brain,
  Rocket,
  Star,
  Trophy,
  Users,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

const GameSelection = () => {
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [showStemProfileModal, setShowStemProfileModal] = useState(false);
  const { sessionData, gameProgress, completedGames, totalScore, loading } = useSession();
  const { stemAffinities, dominantArea, suggestedPlanet, confidenceLevel, loading: affinityLoading, fetchStemAffinities } = useAffinity();
  const { galaxyStats, userContributions, globalRanking, loading: rankingLoading } = useCooperativeRanking();

  // Mostrar automáticamente el modal del perfil STEM cuando se completen todos los juegos
  useEffect(() => {
    console.log('🔍 Debug useEffect modal STEM:', {
      completedGames: completedGames.length,
      stemAffinities: !!stemAffinities,
      suggestedPlanet: !!suggestedPlanet,
      shouldShow: completedGames.length === 4,
      showStemProfileModal
    });
    
    // Solo mostrar automáticamente cuando se completen exactamente 4 juegos
    if (completedGames.length === 4 && !showStemProfileModal) {
      console.log('🎉 Todos los juegos completados! Mostrando modal del perfil STEM...');
      setShowStemProfileModal(true);
    }
  }, [completedGames.length, showStemProfileModal]);

  // Log cuando cambia el estado del modal
  useEffect(() => {
    console.log('🔍 Estado del modal STEM cambiado:', showStemProfileModal);
  }, [showStemProfileModal]);

  // Mostrar mini-juegos si no hay juegos completados
  useEffect(() => {
    if (completedGames.length === 0) {
      setShowMiniGames(true);
    }
  }, [completedGames.length]);

  // Si se muestran los mini-juegos, renderizar el contenedor
  if (showMiniGames) {
    console.log('🎮 Renderizando GameContainer');
    return (
      <GameContainer
        onGameComplete={(gameId, results) => {
          console.log(`Juego ${gameId} completado:`, results);
          // El SessionContext se encargará de guardar el progreso
        }}
        onBackToGames={() => {
          console.log('🔄 Volviendo a la selección de juegos');
          setShowMiniGames(false);
        }}
      />
    );
  }

  console.log('🏠 Renderizando GameSelection:', {
    showMiniGames,
    completedGames: completedGames.length,
    loading,
    affinityLoading,
    rankingLoading
  });

  if (loading || affinityLoading || rankingLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Preparando tu aventura STEM...</p>
        </div>
      </div>
    );
  }

  try {
    console.log('🎨 Renderizando contenido de GameSelection');
    
    return (
      <div className="min-h-screen bg-black relative overflow-hidden py-12">
        {/* Overlay de estrellas espaciales */}
        <div className="stars-overlay"></div>
        
        {/* Partículas flotantes */}
        <div className="space-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header de la página */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
            🌟 Mini-Juegos STEM Espaciales
          </h1>
          <p className="text-xl text-yellow-200 max-w-3xl mx-auto">
            Descubre tus habilidades STEM a través de juegos divertidos y desafiantes. 
            Cada juego es una estrella que ilumina tu camino hacia las carreras del futuro.
          </p>
          
          {/* Estadísticas del usuario */}
          {sessionData && (
            <div className="mt-8 space-y-6">
              <div className="bg-glass border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between max-w-4xl mx-auto text-sm mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">🚀</span>
                    <span className="text-yellow-200 font-semibold">
                      Juegos completados: {completedGames.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">⭐</span>
                    <span className="text-yellow-200 font-semibold">
                      Puntuación total: {totalScore}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">🆔</span>
                    <span className="text-yellow-200 font-semibold">
                      Sesión: {sessionData.session_id?.substring(0, 8)}...
                    </span>
                  </div>
                </div>
                
                {/* Barra de Progreso de Juegos */}
                <div className="max-w-4xl mx-auto">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-yellow-200 text-sm font-medium">Progreso de Juegos:</span>
                    <span className="text-yellow-300 text-sm font-semibold">
                      {completedGames.length}/4 Completados
                    </span>
                  </div>
                  <div className="w-full bg-black/50 border border-yellow-500/30 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-4 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${(completedGames.length / 4) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-yellow-300/80 mt-2">
                    <span>🔢 Puzzle de Números</span>
                    <span>🌱 Invento Verde</span>
                    <span>🌉 Puente Roto</span>
                    <span>🚀 Exploradora Espacial</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mensaje de Felicitación cuando se completen todos los juegos */}
        {completedGames.length === 4 && (
          <div className="text-center mb-12">
            <div className="bg-glass border border-yellow-500/40 rounded-3xl p-8 max-w-3xl mx-auto backdrop-blur-xl relative overflow-hidden">
              {/* Efecto de partículas doradas */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10"></div>
              
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-3xl font-bold text-gradient mb-4">
                ¡Misión Espacial Completada!
              </h3>
              <p className="text-yellow-100 text-lg">
                Has completado todos los juegos de exploración. Tu perfil STEM está listo para descubrir tu planeta ideal en la galaxia del conocimiento.
              </p>
              
              {/* Efecto de estrellas brillantes */}
              <div className="flex justify-center space-x-2 mt-4">
                <span className="text-yellow-400 text-2xl">⭐</span>
                <span className="text-yellow-300 text-2xl">⭐</span>
                <span className="text-yellow-400 text-2xl">⭐</span>
                <span className="text-yellow-300 text-2xl">⭐</span>
                <span className="text-yellow-400 text-2xl">⭐</span>
              </div>
            </div>
          </div>
        )}

        {/* Resultados de Afinidad STEM */}
        {stemAffinities && dominantArea && (
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                🌟 ¡Tu Perfil STEM ha sido Descubierto!
              </h2>
              
              {/* Área Dominante */}
              <div className="mb-8">
                <div className="text-6xl mb-4">
                  {suggestedPlanet?.icon || '🌟'}
                </div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">
                  {dominantArea.charAt(0).toUpperCase() + dominantArea.slice(1)}
                </h3>
                <p className="text-white/80 text-lg mb-4">
                  {suggestedPlanet?.description}
                </p>
                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  <span className="text-green-400">Confianza:</span>
                  <span className="text-white font-semibold capitalize">{confidenceLevel}</span>
                </div>
              </div>

              {/* Puntuaciones por Área */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {Object.entries(stemAffinities).map(([area, data]) => (
                  <div key={area} className={`p-4 rounded-lg ${
                    area === dominantArea 
                      ? 'bg-green-500/20 border border-green-400/30' 
                      : 'bg-white/10 border border-white/20'
                  }`}>
                    <div className="text-2xl mb-2">
                      {area === 'matemáticas' ? '🔢' : 
                       area === 'ciencia' ? '🔬' : 
                       area === 'tecnología' ? '💻' : '⚙️'}
                    </div>
                    <div className="text-sm text-white/70 mb-1 capitalize">
                      {area}
                    </div>
                    <div className={`text-xl font-bold ${
                      area === dominantArea ? 'text-green-400' : 'text-white'
                    }`}>
                      {data.normalizedScore}%
                    </div>
                  </div>
                ))}
              </div>

              {/* Planeta Sugerido */}
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-semibold text-white mb-4">
                  🪐 Tu Planeta STEM Ideal
                </h4>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {suggestedPlanet?.planet}
                </div>
                <p className="text-white/80 mb-4">
                  {suggestedPlanet?.description}
                </p>
                
                {/* Carreras Relacionadas */}
                <div className="text-left">
                  <h5 className="text-lg font-semibold text-white mb-3">
                    🎓 Carreras Relacionadas:
                  </h5>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedPlanet?.careers.map((career, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botón para explorar el planeta */}
                <div className="mt-6">
                  <Link
                    to={`/planet/${dominantArea}`}
                    className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    🚀 Explorar {suggestedPlanet?.planet}
                  </Link>
                </div>
              </div>

              {/* Explorar Otros Planetas */}
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4">
                  🌌 Explora Otros Planetas STEM
                </h4>
                <p className="text-white/80 mb-4">
                  Descubre todos los planetas disponibles y sus características únicas
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.entries(stemAffinities).map(([area, data]) => (
                    <Link
                      key={area}
                      to={`/planet/${area}`}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                        area === dominantArea
                          ? 'bg-green-500/20 border-green-400/50'
                          : 'bg-white/10 border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">
                          {area === 'matemáticas' ? '🔢' : 
                           area === 'ciencia' ? '🔬' : 
                           area === 'tecnología' ? '💻' : '⚙️'}
                        </div>
                        <div className="text-sm font-medium capitalize">
                          {area}
                        </div>
                        <div className="text-xs text-white/60">
                          {data.normalizedScore}% afinidad
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Galaxia Cooperativa STEM */}
        {galaxyStats && (
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl p-8 max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                🌌 ¡Construye la Galaxia STEM!
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Únete a estudiantes de todo el mundo para construir colectivamente una galaxia STEM. 
                Cada juego contribuye al crecimiento de los planetas y al desarrollo de la comunidad.
              </p>

              {/* Estadísticas Globales */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">{galaxyStats.totalStudents}</div>
                  <div className="text-white/70">Estudiantes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">{galaxyStats.totalGamesPlayed}</div>
                  <div className="text-white/70">Juegos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">Nivel {galaxyStats.galaxyLevel}</div>
                  <div className="text-white/70">Galaxia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">{galaxyStats.totalContributions}</div>
                  <div className="text-white/70">Contribuciones</div>
                </div>
              </div>

              {/* Estado de los Planetas */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {Object.entries(galaxyStats.planets).map(([planetKey, planet]) => (
                  <div key={planetKey} className="bg-white/10 rounded-xl p-4">
                    <div className="text-4xl mb-2">{planet.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{planet.name}</h3>
                    <div className="text-2xl font-bold text-indigo-400 mb-2">
                      Nivel {planet.currentLevel}
                    </div>
                    <div className="text-sm text-white/70 mb-2">
                      {planet.currentPoints.toLocaleString()} / {planet.requiredPoints.toLocaleString()} pts
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                      <div 
                        className="bg-indigo-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (planet.currentPoints / planet.requiredPoints) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-white/50">
                      {planet.contributors} contribuidores
                    </div>
                  </div>
                ))}
              </div>

              {/* Ranking Global */}
              {globalRanking.length > 0 && (
                <div className="bg-white/10 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-white mb-4">
                    🏆 Ranking Global de Contribuidores
                  </h4>
                  <div className="grid gap-3">
                    {globalRanking.slice(0, 5).map((player, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-500 text-white' :
                            'bg-white/20 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {player.planet.charAt(0).toUpperCase() + player.planet.slice(1)}
                            </div>
                            <div className="text-white/70 text-sm">
                              {player.games} juegos • {player.achievements} logros
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-indigo-400">
                            {player.points.toLocaleString()}
                          </div>
                          <div className="text-white/70 text-sm">puntos</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón para acceder a los mini-juegos STEM */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              🎮 Mini-Juegos STEM Interactivos
            </h2>
            <p className="text-white/80 mb-6">
              Descubre tus habilidades STEM a través de juegos divertidos y desafiantes. 
              Cada juego evalúa diferentes aspectos de tu potencial.
            </p>
            <button
              onClick={() => setShowMiniGames(true)}
              className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              🎮 Jugar Mini-Juegos STEM
            </button>
          </div>
        </div>

        {/* Información sobre los juegos disponibles */}
        <div className="text-center mb-12">
          <div className="bg-glass border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-2xl font-semibold text-yellow-300 mb-4">
              🌌 Juegos Disponibles en el Sistema Espacial
            </h3>
            <p className="text-yellow-200">
              Estos son los juegos configurados en la base de datos del sistema. Cada uno es una estrella que ilumina tu camino STEM.
            </p>
          </div>
        </div>

        {/* Grid de juegos del sistema - Estilo Kallpa Cards Mejorado */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Puzzle de Números - Matemáticas */}
          <div className="kallpa-card math group">
            <div className="kallpa-card__ribbon">Matemáticas</div>
            <div className="kallpa-card__watermark">Σ</div>
            <div className="kallpa-card__header">
              <div className="kallpa-card__category math">
                <span>🔢</span>
                <span>Matemáticas</span>
              </div>
              {/* Indicador de completado */}
              {gameProgress['number_puzzle'] && (
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-lg">✓</span>
                </div>
              )}
            </div>
            
            <div className="kallpa-card__avatar">
              <span>🦙</span>
              <span>— avatar de Matemáticas</span>
            </div>
            
            <div className="kallpa-card__name">Vicuña</div>
            <div className="kallpa-card__person">Ada Lovelace</div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              Descubre patrones matemáticos en secuencias numéricas y desarrolla tu razonamiento lógico.
            </p>
            
            {/* Estadísticas del juego */}
            <div className="game-stats">
              <div className="game-stat">
                <span className="game-stat__icon">⏱️</span>
                <div className="game-stat__label">Tiempo</div>
                <div className="game-stat__value">3 min</div>
              </div>
              <div className="game-stat">
                <span className="game-stat__icon">🎯</span>
                <div className="game-stat__label">Dificultad</div>
                <div className="game-stat__value">Intermedio</div>
              </div>
              <div className="game-stat">
                <span className="game-stat__icon">⭐</span>
                <div className="game-stat__label">Puntos</div>
                <div className="game-stat__value">
                  {gameProgress['number_puzzle']?.score || 0} pts
                </div>
              </div>
            </div>
            
            {/* Habilidades evaluadas */}
            <div className="skills-section">
              <h4 className="skills-title">Habilidades evaluadas:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="skill-tag">Razonamiento lógico</span>
                <span className="skill-tag">Patrones matemáticos</span>
                <span className="skill-tag">Velocidad de resolución</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowMiniGames(true)}
              className="game-play-button"
            >
              <span className="game-play-button__icon">▷</span>
              {gameProgress['number_puzzle'] ? 'Jugar de Nuevo' : 'Jugar Ahora'}
            </button>
            
            {/* Puntos de progreso como en la imagen */}
            <div className="kallpa-card__progress">
              <div className={`kallpa-card__dot ${gameProgress['number_puzzle'] ? 'active' : ''}`}></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
            </div>
          </div>

          {/* Invento Verde - Ingeniería (Eco) */}
          <div className="kallpa-card engineering kallpa-card--eco group">
            <div className="kallpa-card__ribbon">Ingeniería</div>
            <div className="kallpa-card__watermark">🌿</div>
            <div className="kallpa-card__header">
              <div className="kallpa-card__category engineering">
                <span>🌱</span>
                <span>Ingeniería</span>
              </div>
              {/* Indicador de completado */}
              {gameProgress['green_invention'] && (
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-lg">✓</span>
                </div>
              )}
            </div>
            
            <div className="kallpa-card__avatar">
              <span>🐆</span>
              <span>— avatar de Ingeniería</span>
            </div>
            
            <div className="kallpa-card__name">Jaguar</div>
            <div className="kallpa-card__person">Katherine Johnson</div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              Diseña soluciones ambientales innovadoras y muestra tu creatividad aplicada.
            </p>
            
            {/* Estadísticas del juego */}
            <div className="game-stats">
              <div className="game-stat">
                <span className="game-stat__icon">⏱️</span>
                <div className="game-stat__label">Tiempo</div>
                <div className="game-stat__value">3 min</div>
              </div>
              <div className="game-stat">
                <span className="game-stat__icon">🎯</span>
                <div className="game-stat__label">Dificultad</div>
                <div className="game-stat__value">Avanzado</div>
              </div>
              <div className="game-stat">
                <span className="game-stat__icon">⭐</span>
                <div className="game-stat__label">Puntos</div>
                <div className="game-stat__value">
                  {gameProgress['green_invention']?.score || 0} pts
                </div>
              </div>
            </div>
            
            {/* Habilidades evaluadas */}
            <div className="skills-section">
              <h4 className="skills-title">Habilidades evaluadas:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="skill-tag">Creatividad aplicada</span>
                <span className="skill-tag">Pensamiento ingenieril</span>
                <span className="skill-tag">Sostenibilidad</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowMiniGames(true)}
              className="game-play-button"
            >
              <span className="game-play-button__icon">▷</span>
              {gameProgress['green_invention'] ? 'Jugar de Nuevo' : 'Jugar Ahora'}
            </button>
            
            {/* Puntos de progreso como en la imagen */}
            <div className="kallpa-card__progress">
              <div className={`kallpa-card__dot ${gameProgress['green_invention'] ? 'active' : ''}`}></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
            </div>
          </div>

          {/* El Puente Roto - Ingeniería (Civil) */}
          <div className="kallpa-card engineering kallpa-card--civil group">
            <div className="kallpa-card__ribbon">Ingeniería</div>
            <div className="kallpa-card__watermark">🏗️</div>
            <div className="kallpa-card__header">
              <div className="kallpa-card__category engineering">
                <span>🌉</span>
                <span>Ingeniería</span>
              </div>
              {/* Indicador de completado */}
              {gameProgress['broken_bridge'] && (
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-lg">✓</span>
                </div>
              )}
            </div>
            
            <div className="kallpa-card__avatar">
              <span>🏗️</span>
              <span>— avatar de Ingeniería</span>
            </div>
            
            <div className="kallpa-card__name">Puente</div>
            <div className="kallpa-card__person">Gustave Eiffel</div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              Resuelve desafíos de ingeniería civil y demuestra tu capacidad de análisis estructural.
            </p>
            
            {/* Estadísticas del juego */}
            <div className="game-stats">
              <div className="game-stat">
                <span className="game-stat__icon">⏱️</span>
                <div className="game-stat__label">Tiempo</div>
                <div className="game-stat__value">3 min</div>
              </div>
              <div className="game-stat">
                <span className="game-stat__icon">🎯</span>
                <div className="game-stat__label">Dificultad</div>
                <div className="game-stat__value">Intermedio</div>
              </div>
              <div className="game-stat">
                <span className="game-stat__icon">⭐</span>
                <div className="game-stat__label">Puntos</div>
                <div className="game-stat__value">
                  {gameProgress['broken_bridge']?.score || 0} pts
                </div>
              </div>
            </div>
            
            {/* Habilidades evaluadas */}
            <div className="skills-section">
              <h4 className="skills-title">Habilidades evaluadas:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="skill-tag">Resolución de problemas</span>
                <span className="skill-tag">Análisis de restricciones</span>
                <span className="skill-tag">Toma de decisiones</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowMiniGames(true)}
              className="game-play-button"
            >
              <span className="game-play-button__icon">▷</span>
              {gameProgress['broken_bridge'] ? 'Jugar de Nuevo' : 'Jugar Ahora'}
            </button>
            
            {/* Puntos de progreso como en la imagen */}
            <div className="kallpa-card__progress">
              <div className={`kallpa-card__dot ${gameProgress['broken_bridge'] ? 'active' : ''}`}></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
            </div>
          </div>

          {/* Exploradora Espacial - Tecnología (Circuito/Órbitas) */}
          <div className="kallpa-card tech kallpa-card--tech-circuit group">
            <div className="kallpa-card__ribbon">Tecnología</div>
            <div className="kallpa-card__watermark">🚀</div>
            <div className="kallpa-card__header">
              <div className="kallpa-card__category tech">
                <span>🚀</span>
                <span>Tecnología</span>
              </div>
              {/* Indicador de completado */}
              {gameProgress['space_explorer'] && (
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-lg">✓</span>
                </div>
              )}
            </div>
            
            <div className="kallpa-card__avatar">
              <span>🛸</span>
              <span>— avatar de Tecnología</span>
            </div>
            
            <div className="kallpa-card__name">Nave</div>
            <div className="kallpa-card__person">Hedy Lamarr</div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              Diseña misiones espaciales con restricciones técnicas y optimiza sistemas complejos.
            </p>
            
            {/* Estadísticas del juego */}
            <div className="game-stats">
              <div className="game-stat">
                <span className="game-stat__icon">⏱️</span>
                <div className="game-stat__label">Tiempo</div>
                <div className="game-stat__value">3 min</div>
              </div>
              <div className="game-stat">
                <span className="game-stat__icon">🎯</span>
                <div className="game-stat__label">Dificultad</div>
                <div className="game-stat__value">Avanzado</div>
              </div>
              <div className="game-stat">
                <span className="game-stat__icon">⭐</span>
                <div className="game-stat__label">Puntos</div>
                <div className="game-stat__value">
                  {gameProgress['space_explorer']?.score || 0} pts
                </div>
              </div>
            </div>
            
            {/* Habilidades evaluadas */}
            <div className="skills-section">
              <h4 className="skills-title">Habilidades evaluadas:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="skill-tag">Afinidad tecnológica</span>
                <span className="skill-tag">Ciencias exactas</span>
                <span className="skill-tag">Optimización de sistemas</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowMiniGames(true)}
              className="game-play-button"
            >
              <span className="game-play-button__icon">▷</span>
              {gameProgress['space_explorer'] ? 'Jugar de Nuevo' : 'Jugar Ahora'}
            </button>
            
            {/* Puntos de progreso como en la imagen */}
            <div className="kallpa-card__progress">
              <div className={`kallpa-card__dot ${gameProgress['space_explorer'] ? 'active' : ''}`}></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
              <div className="kallpa-card__dot"></div>
            </div>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="text-center mt-16 space-y-6">
          <Link
            to="/"
            className="btn-primary px-8 py-4 inline-flex items-center text-lg hover:scale-105 transition-transform duration-300"
          >
            🏠 Volver al Inicio Espacial
          </Link>
          
          {/* Botón de debug para forzar modal */}
          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                console.log('🎯 Abriendo modal STEM manualmente');
                setShowStemProfileModal(true);
              }}
              className="btn-secondary px-6 py-3 inline-flex items-center"
            >
              🎯 Mostrar Perfil STEM Manualmente
            </button>
            
            <button
              onClick={() => fetchStemAffinities()}
              className="btn-primary px-6 py-3 inline-flex items-center"
            >
              🔄 Obtener Afinidades STEM
            </button>
            
            <button
              onClick={() => {
                localStorage.removeItem('kallpaia_completed_games');
                window.location.reload();
              }}
              className="btn-outline px-6 py-3 inline-flex items-center border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/10"
            >
              🗑️ Limpiar y Reiniciar
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="btn-outline px-6 py-3 inline-flex items-center border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/10"
            >
              🔄 Recargar Página
            </button>
            
            <button
              onClick={() => {
                console.log('🧪 Test de renderizado');
                setShowMiniGames(false);
                setShowStemProfileModal(false);
              }}
              className="btn-outline px-6 py-3 inline-flex items-center border-2 border-yellow-500/30 hover:border-yellow-500/60 text-yellow-400 hover:bg-yellow-500/10"
            >
              🧪 Test Renderizado
            </button>
            
            <div className="text-sm text-white/60 mt-2 text-center">
              Debug: {completedGames.length}/4 juegos completados
            </div>
          </div>
          

        </div>
      </div>

      {/* Debug info */}
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm z-40 max-w-xs">
        <div className="font-bold mb-2">🔍 DEBUG INFO</div>
        <div>Modal: {showStemProfileModal ? '✅ SÍ' : '❌ NO'}</div>
        <div>Juegos: {completedGames.length}/4</div>
        <div>Affinities: {stemAffinities ? '✅ SÍ' : '❌ NO'}</div>
        <div>Planeta: {suggestedPlanet ? '✅ SÍ' : '❌ NO'}</div>
        <div>Área: {dominantArea || 'N/A'}</div>
        <div className="mt-2 text-xs">
          {completedGames.map(game => (
            <div key={game}>✅ {game}</div>
          ))}
        </div>
      </div>

      {showStemProfileModal && (
        <StemProfileModal
          isOpen={showStemProfileModal}
          onClose={() => {
            console.log('🔒 Cerrando modal STEM');
            setShowStemProfileModal(false);
          }}
        />
      )}
    </div>
  );
  } catch (error) {
    console.error('❌ Error renderizando GameSelection:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Error en la página</h1>
          <p className="text-white/80 mb-6">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-3"
          >
            🔄 Recargar Página
          </button>
        </div>
      </div>
    );
  }
};

export default GameSelection;
