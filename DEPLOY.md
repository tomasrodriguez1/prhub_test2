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
   - **IMPORTANTE**: Si Render pregunta por el directorio de publicación, déjalo vacío o usa `.`
   
   O configura manualmente:
   - **Name**: `pr-hub`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Root Directory**: `.` (raíz del proyecto)

4. **Variables de Entorno**
   - Render configurará automáticamente la variable `PORT`
   - No se requieren variables adicionales

5. **Deploy**
   - Haz clic en "Create Web Service"
   - Render construirá y desplegará automáticamente
   - El build puede tardar 3-5 minutos
   - El servicio estará disponible en la URL que Render asigne

## Notas Importantes

- **Directorio de build**: Vite genera los archivos en `dist/` 
- El servidor usa `vite preview` que sirve los archivos desde `dist/`
- Render ofrece un plan gratuito con sleep después de 15 minutos de inactividad
- Para evitar el sleep, considera el plan Starter ($7/mes)
- Los cambios en GitHub se desplegarán automáticamente si tienes auto-deploy habilitado

## Troubleshooting

### Error: "Publish directory build does not exist"
Este error significa que Render está buscando un directorio `build` pero Vite genera en `dist`.
**Solución**: El script `start` usa `vite preview` que automáticamente sirve desde `dist/`. No necesitas especificar un directorio de publicación en Render.

### El build falla
- Verifica los logs en Render Dashboard
- Asegúrate de que `package.json` tenga el script `start`
- Verifica que todas las dependencias estén listadas correctamente

### El sitio no carga
- Verifica que el servidor esté escuchando en todas las interfaces (`0.0.0.0`)
- Verifica que esté usando la variable de entorno `PORT` de Render
- Revisa los logs del servicio en Render Dashboard
