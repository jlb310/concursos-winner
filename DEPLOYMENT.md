# Guía de Despliegue en Dockploy

## 📋 Requisitos Previos
- Cuenta de GitHub
- Acceso a Dockploy
- Git instalado en tu máquina

## 🚀 Paso 1: Preparar el Repositorio en GitHub

### 1.1 Crear un nuevo repositorio en GitHub
1. Ve a [GitHub](https://github.com/new)
2. Nombre sugerido: `sorteos-instagram-pro`
3. Déjalo como **público** o **privado** (según prefieras)
4. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
5. Haz clic en "Create repository"

### 1.2 Subir el código al repositorio

Ejecuta estos comandos en la terminal (desde el directorio del proyecto):

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Sorteos Instagram Pro"

# Agregar el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/sorteos-instagram-pro.git

# Subir el código
git branch -M main
git push -u origin main
```

**Nota**: Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

## 🐳 Paso 2: Configurar en Dockploy

### 2.1 Crear un nuevo proyecto
1. Inicia sesión en tu panel de Dockploy
2. Haz clic en **"Create Project"** o **"New Application"**
3. Selecciona **"Deploy from GitHub"**

### 2.2 Conectar el repositorio
1. Autoriza a Dockploy para acceder a tus repositorios de GitHub (si no lo has hecho)
2. Selecciona el repositorio `sorteos-instagram-pro`
3. Selecciona la rama `main`

### 2.3 Configuración del proyecto

**Configuración básica:**
- **Project Name**: `sorteos-instagram-pro`
- **Build Type**: `Dockerfile`
- **Dockerfile Path**: `Dockerfile` (ya está en la raíz)
- **Port**: `3000`

**Variables de entorno** (opcional):
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 2.4 Configurar dominio (opcional)
1. En la sección de **"Domains"**, agrega tu dominio personalizado
2. Ejemplo: `sorteos.tudominio.com`
3. Dockploy generará automáticamente un certificado SSL

### 2.5 Desplegar
1. Haz clic en **"Deploy"** o **"Create & Deploy"**
2. Espera a que el build termine (puede tomar 3-5 minutos)
3. Una vez completado, verás el estado como **"Running"**

---

## ✅ Paso 3: Verificar el Despliegue

1. Accede a la URL proporcionada por Dockploy (ej: `https://sorteos-instagram-pro.dockploy.app`)
2. Verifica que la aplicación cargue correctamente
3. Prueba el flujo completo:
   - Ingresar una URL
   - Ver participantes
   - Realizar sorteo

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios en el código:

```bash
# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push origin main
```

Dockploy detectará automáticamente los cambios y redesplegará la aplicación.

---

## 🛠️ Solución de Problemas

### El build falla
- Verifica que el `Dockerfile` esté en la raíz del proyecto
- Revisa los logs de build en Dockploy
- Asegúrate de que `package.json` tenga todas las dependencias

### La aplicación no inicia
- Verifica que el puerto sea `3000`
- Revisa los logs de la aplicación en Dockploy
- Asegúrate de que `output: 'standalone'` esté en `next.config.ts`

### Problemas de SSL
- Espera unos minutos después del despliegue
- Verifica que el dominio esté correctamente configurado
- Contacta al soporte de Dockploy si persiste

---

## 📞 Soporte

Si tienes problemas, revisa:
- [Documentación de Dockploy](https://dockploy.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- Logs en el panel de Dockploy
