import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Información principal */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-stem-tech-500 to-stem-math-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gradient font-space">
                KallpaIA
              </h3>
            </div>
            <p className="text-white/70 mb-4 max-w-md">
              Inspirando el futuro de las mujeres en STEM a través de la gamificación 
              y el autoconocimiento lúdico.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/games"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Mini-Juegos
                </Link>
              </li>
              <li>
                <Link
                  to="/affinity"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Resultados STEM
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos STEM */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Recursos STEM</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Carreras en Tecnología
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Mujeres en Ingeniería
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Comunidad WIE
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Información legal */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} KallpaIA. Todos los derechos reservados.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Términos de Uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>

        {/* Mensaje inspiracional */}
        <div className="text-center mt-8 pt-6 border-t border-white/10">
          <p className="text-white/50 text-sm italic">
            "El futuro pertenece a quienes creen en la belleza de sus sueños STEM" 
            <span className="text-stem-tech-400 ml-2">✨</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
