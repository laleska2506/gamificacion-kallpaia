import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Título principal */}
          <div className="mb-16">
            <h1 className="text-7xl md:text-9xl font-bold mb-8 text-gradient">
              KallpaIA
            </h1>
            <div className="mb-6">
              <p className="text-3xl md:text-4xl text-yellow-300 font-light mb-4">
                🚀 Descubre tu potencial en el universo
              </p>
              <p className="text-xl text-yellow-200 font-light">
                <span className="text-yellow-400 font-semibold">STEM</span> a través de la gamificación espacial
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-20">
            <div className="bg-glass border border-yellow-500/30 rounded-3xl p-8 backdrop-blur-xl">
              <p className="text-xl text-yellow-100 max-w-4xl mx-auto leading-relaxed">
                🌟 Embárcate en una aventura espacial donde cada mini-juego es una estrella que ilumina 
                tu camino hacia las carreras STEM. Sin preguntas personales, solo tu ingenio y creatividad 
                te llevarán a descubrir tu planeta ideal en la galaxia del conocimiento.
              </p>
            </div>
          </div>

          {/* CTA principal */}
          <div className="text-center">
            <Link
              to="/games"
              className="btn-primary text-2xl px-12 py-6 inline-flex items-center group hover:scale-105 transition-transform duration-300"
            >
              🚀 Comenzar Aventura Espacial
              <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>

          {/* Elementos decorativos espaciales */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-3">🔢</div>
              <h3 className="text-lg font-semibold text-yellow-300">Matemáticas</h3>
              <p className="text-sm text-yellow-200">Lógica y patrones</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-lg font-semibold text-yellow-300">Ingeniería</h3>
              <p className="text-sm text-yellow-200">Creatividad aplicada</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold text-yellow-300">Tecnología</h3>
              <p className="text-sm text-yellow-200">Innovación futura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
