# 🚀 Despliegue en Vercel - KallpaIA

## 📋 Pasos para Desplegar el Frontend

### 1. Preparar el Proyecto

Asegúrate de que tu proyecto esté en GitHub y que tengas una cuenta en [Vercel](https://vercel.com).

### 2. Configurar Variables de Entorno

Antes de desplegar, necesitas configurar la URL de tu backend:

1. Ve a tu proyecto en Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tu-backend-url.vercel.app` (o la URL real de tu backend)

### 3. Desplegar en Vercel

#### Opción A: Desde la Web de Vercel (Recomendada)

1. Ve a [vercel.com](https://vercel.com) y inicia sesión
2. Haz clic en **"New Project"**
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Haz clic en **"Deploy"**

#### Opción B: Desde la Terminal

```bash
# Instalar Vercel CLI
npm i -g vercel

# Navegar al directorio del frontend
cd frontend

# Desplegar
vercel

# Seguir las instrucciones en la terminal
```

### 4. Configuración del Backend

Para que tu aplicación funcione completamente, necesitas desplegar el backend. Opciones recomendadas:

#### Opción A: Railway (Gratis)
```bash
cd backend
# Instalar Railway CLI y seguir instrucciones
```

#### Opción B: Render (Gratis)
```bash
cd backend
# Conectar repositorio y configurar build
```

#### Opción C: Heroku (Pago)
```bash
cd backend
# Usar Heroku CLI para despliegue
```

### 5. Actualizar URL del Backend

Una vez que tengas tu backend desplegado:

1. Copia la URL del backend
2. Ve a tu proyecto en Vercel
3. Actualiza la variable de entorno `VITE_API_URL`
4. Redespliega el frontend

## 🔧 Configuración Adicional

### Archivos Creados

- `frontend/vercel.json` - Configuración de Vercel
- `frontend/src/config/api.js` - Configuración de API

### Verificar Despliegue

1. Tu aplicación estará disponible en: `https://tu-proyecto.vercel.app`
2. Verifica que las llamadas a la API funcionen
3. Revisa la consola del navegador para errores

## 🚨 Solución de Problemas

### Error: "Module not found"
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que `npm install` se ejecute correctamente

### Error: "API calls failing"
- Verifica la variable de entorno `VITE_API_URL`
- Asegúrate de que el backend esté funcionando
- Revisa CORS en tu backend

### Error: "Build failing"
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en Vercel

## 🌟 Ventajas de Vercel

- **Despliegue automático** desde GitHub
- **CDN global** para mejor rendimiento
- **SSL automático** y HTTPS
- **Preview deployments** para cada PR
- **Analytics** integrados
- **Edge Functions** para lógica del servidor

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la documentación de Vercel
3. Consulta los issues del proyecto

---

**¡Tu aplicación KallpaIA estará desplegada en minutos! 🚀✨**
