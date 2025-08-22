#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Iniciando build para Vercel...');

// Verificar que estamos en el directorio correcto
if (!existsSync('package.json')) {
  console.error('❌ Error: No se encontró package.json');
  console.error('   Asegúrate de estar en el directorio frontend/');
  process.exit(1);
}

// Verificar dependencias
console.log('📦 Verificando dependencias...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencias instaladas correctamente');
} catch (error) {
  console.error('❌ Error instalando dependencias:', error.message);
  process.exit(1);
}

// Verificar configuración de Vercel
console.log('🔧 Verificando configuración de Vercel...');
if (!existsSync('vercel.json')) {
  console.warn('⚠️  Advertencia: No se encontró vercel.json');
  console.warn('   Se usará la configuración por defecto de Vite');
}

// Ejecutar build
console.log('🏗️  Ejecutando build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completado exitosamente');
} catch (error) {
  console.error('❌ Error en build:', error.message);
  process.exit(1);
}

// Verificar archivos de salida
console.log('📁 Verificando archivos de salida...');
const distPath = join(process.cwd(), 'dist');
if (!existsSync(distPath)) {
  console.error('❌ Error: No se encontró el directorio dist/');
  process.exit(1);
}

console.log('🎉 Build listo para Vercel!');
console.log('📂 Archivos en:', distPath);
console.log('🚀 Puedes desplegar ahora en Vercel');
