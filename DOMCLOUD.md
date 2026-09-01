# Despliegue en DOM Cloud

La aplicación se exporta como una SPA estática de Expo Router en la carpeta
`dist`. La carpeta se guarda en Git para que DOM Cloud no tenga que compilar
Expo dentro de un servidor con memoria limitada.

## Despliegue inicial

1. Crear un sitio en DOM Cloud.
2. Abrir **Setup > Deploy**.
3. Copiar el contenido de `domcloud.yml` en el script de despliegue.
4. Ejecutar el despliegue.

La receta clona la rama predeterminada del repositorio, comprueba que exista
`dist/index.html` y configura NGINX para servir directamente `dist`.
El fallback a `/index.html` permite abrir directamente las rutas de Expo
Router sin errores 404.

## Actualizaciones

Después de cambiar la aplicación, ejecutar `npm run build`, subir también los
cambios generados en `dist` a `main` y desplegar nuevamente desde DOM Cloud.

## Verificación local

```sh
npm ci
npm run build
```
