import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, ArrowRight } from 'lucide-react';

const AffinityResults = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="w-24 h-24 bg-stem-science-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-12 h-12 text-stem-science-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Resultados STEM
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Descubre tus afinidades en Ciencia, Tecnología, Ingeniería y Matemáticas 
            basadas en tu rendimiento en los mini-juegos.
          </p>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Funcionalidad en Desarrollo
            </h2>
            
            <p className="text-white/70 mb-6">
              Esta página mostrará un análisis detallado de tus habilidades STEM, 
              incluyendo gráficos, porcentajes y recomendaciones personalizadas.
            </p>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="text-center">
                <div className="w-16 h-16 bg-stem-math-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-stem-math-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Análisis de Rendimiento</h3>
                <p className="text-white/70 text-sm">
                  Gráficos detallados de tus scores en cada área STEM
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-stem-tech-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-stem-tech-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Recomendaciones</h3>
                <p className="text-white/70 text-sm">
                  Sugerencias personalizadas para tu desarrollo STEM
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/games"
              className="btn-primary flex items-center space-x-2"
            >
              <span>Jugar Mini-Juegos</span>
              <ArrowRight className="w-5 h-5" />
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

export default AffinityResults;
