# Despliegue en DOM Cloud

La aplicación se exporta como una SPA estática de Expo Router en la carpeta
`dist`. La carpeta es generada y no se guarda en Git.

## Despliegue inicial

1. Crear un sitio en DOM Cloud.
2. Abrir **Setup > Deploy**.
3. Copiar el contenido de `domcloud.yml` en el script de despliegue.
4. Ejecutar el despliegue.

La receta clona la rama predeterminada del repositorio, instala Node.js 20,
ejecuta `npm ci` y compila con un solo proceso y sin JIT para ajustarse a la
memoria disponible en DOM Cloud. Luego configura NGINX para servir `dist`.
El fallback a `/index.html` permite abrir directamente las rutas de Expo
Router sin errores 404.

## Actualizaciones

Después de subir cambios a `main`, ejecutar nuevamente el despliegue desde el
panel de DOM Cloud.

## Verificación local

```sh
npm ci
npm run build
```
