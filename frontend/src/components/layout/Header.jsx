import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Star, Brain, Zap } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';

const Header = () => {
  const location = useLocation();
  const { sessionId, sessionData } = useSession();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Inicio', icon: Rocket },
    { path: '/games', label: 'Juegos', icon: Star },
    { path: '/affinity', label: 'Resultados', icon: Brain },
  ];

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-stem-tech-500 to-stem-math-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient font-space">
                KallpaIA
              </h1>
              <p className="text-xs text-white/60">STEM Gamification</p>
            </div>
          </Link>

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-stem-tech-500/20 text-stem-tech-400 border border-stem-tech-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Información de sesión */}
          <div className="flex items-center space-x-4">
            {sessionId && (
              <div className="hidden sm:flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-stem-science-400 rounded-full animate-pulse"></div>
                  <span className="text-white/60">Sesión activa</span>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full">
                  <span className="text-white/80 font-mono text-xs">
                    {sessionId.substring(0, 8)}...
                  </span>
                </div>
              </div>
            )}

            {/* Indicadores STEM */}
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-3 h-3 bg-stem-math-400 rounded-full opacity-60"></div>
              <div className="w-3 h-3 bg-stem-science-400 rounded-full opacity-60"></div>
              <div className="w-3 h-3 bg-stem-tech-400 rounded-full opacity-60"></div>
              <div className="w-3 h-3 bg-stem-engineering-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Navegación móvil */}
        <div className="md:hidden py-4 border-t border-white/10">
          <nav className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-stem-tech-500/20 text-stem-tech-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
