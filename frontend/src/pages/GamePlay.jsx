import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, Target } from 'lucide-react';

const GamePlay = () => {
  const { gameId } = useParams();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Botón de regreso */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            to="/games"
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Juegos</span>
          </Link>
        </motion.div>

        {/* Contenido del juego */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="w-24 h-24 bg-stem-tech-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-12 h-12 text-stem-tech-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Juego en Desarrollo
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Esta funcionalidad está siendo implementada. Pronto podrás jugar al mini-juego 
            y descubrir tus habilidades STEM de forma interactiva.
          </p>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              ¿Qué esperar?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-stem-math-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-stem-math-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Duración</h3>
                <p className="text-white/70 text-sm">
                  Juegos de 2-3 minutos para mantener el interés
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-stem-science-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-stem-science-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Objetivo</h3>
                <p className="text-white/70 text-sm">
                  Descubrir afinidades STEM de forma lúdica
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-stem-tech-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Gamificación</h3>
                <p className="text-white/70 text-sm">
                  Puntuaciones, badges y recompensas
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/games"
              className="btn-secondary"
            >
              Ver Otros Juegos
            </Link>
            
            <Link
              to="/"
              className="btn-outline"
            >
              Volver al Inicio
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePlay;
