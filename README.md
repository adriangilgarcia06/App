# Plapp v1 PWA

Plapp = Plan + App.

## Qué incluye

- Nombre cambiado a Plapp.
- Preparada como PWA instalable.
- `manifest.webmanifest`.
- `service-worker.js`.
- Iconos SVG.
- Panel de administrador con estados:
  - Aceptada
  - Rechazada / No
  - Pendiente
  - Alternativa propuesta
- Campo de comentario del administrador para explicar motivo o alternativa.

## Acceso Carla

Usuario:

```txt
Carla
```

Contraseña:

```txt
carlalamejor
```

## Administrador

Contraseña:

```txt
admin.1
```

## Instalación en móvil

### iPhone

1. Sube la app a GitHub Pages o Netlify.
2. Abre el enlace en Safari.
3. Pulsa Compartir.
4. Pulsa Añadir a pantalla de inicio.
5. Activa Abrir como app web si aparece.

### Android

1. Abre el enlace en Chrome.
2. Pulsa el menú de tres puntos.
3. Pulsa Instalar app o Añadir a pantalla de inicio.

## Importante sobre solicitudes entre móviles

Esta versión ya es instalable, pero todavía guarda solicitudes en el navegador con `localStorage`.

Para que Carla mande desde su móvil y Ángel lo vea en el suyo, hay que conectar Firebase o Supabase.

Arquitectura recomendada:

- Frontend: esta PWA.
- Base de datos: Firebase Firestore.
- Autenticación sencilla: usuarios controlados desde panel admin.
- Colección `requests`: solicitudes de planes.
- Colección `users`: usuarios permitidos.
- Campo `status`: Pendiente, Aceptada, Rechazada, Alternativa propuesta.
- Campo `adminComment`: motivo o alternativa.

## Actualizaciones

Si está subida a GitHub Pages o Netlify, no hace falta borrar la app. Subes los archivos nuevos al mismo repositorio/proyecto y la app se actualizará al abrirla.
