# 🚀 Despliegue del Backend - KallpaIA

## 📋 Opciones de Despliegue

### **Opción 1: Railway (Recomendada - Gratuita)**
- ✅ Base de datos PostgreSQL incluida
- ✅ Despliegue automático desde GitHub
- ✅ SSL automático
- ✅ Muy fácil de configurar

### **Opción 2: Render (Alternativa Gratuita)**
- ✅ Base de datos PostgreSQL incluida
- ✅ Despliegue automático
- ✅ SSL automático
- ✅ Buena documentación

## 🚀 Despliegue en Railway

### 1. Preparar el Proyecto

Asegúrate de que tu backend esté en GitHub y que hayas hecho commit de todos los archivos de configuración.

### 2. Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en **"Start a New Project"**

### 3. Conectar Repositorio

1. Selecciona **"Deploy from GitHub repo"**
2. Busca y selecciona tu repositorio
3. Haz clic en **"Deploy Now"**

### 4. Configurar Base de Datos

1. En tu proyecto, haz clic en **"New"**
2. Selecciona **"Database"** → **"PostgreSQL"**
3. Railway creará automáticamente una base de datos

### 5. Configurar Variables de Entorno

1. Ve a tu proyecto en Railway
2. Haz clic en **"Variables"**
3. Agrega las siguientes variables:

```env
NODE_ENV=production
PORT=3001
DB_USER=postgres
DB_HOST=tu_host_db_railway
DB_NAME=railway
DB_PASSWORD=tu_password_db_railway
DB_PORT=5432
FRONTEND_URL=https://gamificacion-kallpaia-kappa.vercel.app
```

**Nota**: Railway te dará estas credenciales automáticamente cuando crees la base de datos.

### 6. Ejecutar Migración

1. Ve a la pestaña **"Deployments"**
2. Haz clic en **"View Logs"**
3. Ejecuta la migración manualmente o agrega este comando en Railway:

```bash
npm run migrate:prod
```

### 7. Verificar Despliegue

Tu API estará disponible en: `https://tu-proyecto.railway.app`

## 🌐 Despliegue en Render

### 1. Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en **"New +"**

### 2. Crear Servicio Web

1. Selecciona **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `kallpaia-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 3. Crear Base de Datos

1. Haz clic en **"New +"**
2. Selecciona **"PostgreSQL"**
3. Configura:
   - **Name**: `kallpaia-db`
   - **Plan**: `Free`
   - **Database**: `kallpaia_gamification`

### 4. Configurar Variables de Entorno

En tu servicio web, agrega:

```env
NODE_ENV=production
PORT=10000
DB_USER=tu_usuario_db
DB_HOST=tu_host_db
DB_NAME=tu_nombre_db
DB_PASSWORD=tu_password_db
DB_PORT=5432
FRONTEND_URL=https://gamificacion-kallpaia-kappa.vercel.app
```

### 5. Ejecutar Migración

1. Ve a tu servicio web
2. Haz clic en **"Shell"**
3. Ejecuta:

```bash
npm run migrate:prod
```

## 🔧 Configuración del Frontend

Una vez que tengas tu backend desplegado:

1. **Copia la URL del backend** (ej: `https://tu-proyecto.railway.app`)
2. **Ve a tu proyecto en Vercel**
3. **Actualiza la variable de entorno**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tu-proyecto.railway.app`
4. **Redespliega el frontend**

## 🚨 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica las variables de entorno
- Asegúrate de que la base de datos esté activa
- Revisa los logs del servicio

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` esté configurado correctamente
- Asegúrate de que la URL del frontend coincida exactamente

### Error: "Port already in use"
- Railway y Render asignan puertos automáticamente
- Usa `process.env.PORT` en tu código

### Error: "Migration failed"
- Verifica la conexión a la base de datos
- Revisa los permisos del usuario de la base de datos
- Ejecuta la migración manualmente desde la consola

## 📊 Verificar Funcionamiento

### 1. Health Check
```bash
curl https://tu-backend-url.railway.app/api/health
```

### 2. Crear Sesión
```bash
curl -X POST https://tu-backend-url.railway.app/api/sessions/create
```

### 3. Verificar CORS
Abre la consola del navegador en tu frontend y verifica que las llamadas a la API funcionen.

## 🌟 Ventajas de Railway/Render

- **Gratuitos** para proyectos pequeños
- **Base de datos incluida**
- **Despliegue automático** desde GitHub
- **SSL automático**
- **Escalabilidad** fácil
- **Logs en tiempo real**

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway/Render
2. Verifica la documentación oficial
3. Consulta los issues del proyecto
4. Revisa la configuración de variables de entorno

---

**¡Tu backend estará funcionando en minutos! 🚀✨**
