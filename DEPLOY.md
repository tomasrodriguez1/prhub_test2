# Guía de Deploy en Render

## Pasos para Deploy

1. **Sube tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/pr-hub.git
   git push -u origin main
   ```

2. **Conecta con Render**
   - Ve a [Render Dashboard](https://dashboard.render.com)
   - Haz clic en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `pr-hub`

3. **Configuración Automática**
   - Render detectará automáticamente el archivo `render.yaml`
   - O puedes configurar manualmente:
     - **Name**: `pr-hub`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start`
     - **Root Directory**: `.` (raíz del proyecto)

4. **Variables de Entorno**
   - No se requieren variables de entorno para esta aplicación
   - Render configurará automáticamente `PORT`

5. **Deploy**
   - Haz clic en "Create Web Service"
   - Render construirá y desplegará automáticamente
   - El servicio estará disponible en `https://pr-hub.onrender.com` (o el nombre que elijas)

## Notas Importantes

- El build puede tardar 2-5 minutos
- Render ofrece un plan gratuito con sleep después de 15 minutos de inactividad
- Para evitar el sleep, considera el plan Starter ($7/mes)
- Los cambios en GitHub se desplegarán automáticamente si tienes auto-deploy habilitado

## Troubleshooting

- Si el build falla, verifica los logs en Render Dashboard
- Asegúrate de que `package.json` tenga el script `start`
- Verifica que todas las dependencias estén en `dependencies` o `devDependencies`

