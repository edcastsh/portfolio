# Contexto del proyecto

## Estado actual

- Proyecto React + Vite + TypeScript scaffoldeado.
- Husky + validación de nombre de rama configurados.
- ESLint, Prettier y Release Please configurados.
- Skills de hola-ai movidos a `~/.agents/skills/` (`backlog`, `story`, `pair`).
- Secciones del portafolio cargadas con datos reales del CV de Erick Edel Beltrán Castillo (hero, sobre mí, proyectos, cifras, tecnologías, trayectoria, educación, contacto).
- Avatar con `@blobatar/react`: genera blobatar aleatorio por visita, sigue cursor con la mirada (`useGaze`), animación continua y fallback `touchmove` para móviles.
- Avatar flotante: recorre los 4 bordes con un padding de 24px respecto a los bordes de la ventana; entre bordes se esconde y vuelve a entrar con animación suave.
- Sección "En cifras" / "By the numbers" eliminada.
- Hero reorganizado: ceja = rol, h1 = nombre, línea de ubicación, tagline; evita repetir rol en la tarjeta "Sobre mí".
- Proyectos clickeables con links reales.
- Redundancia de nombre reducida en hints y tarjetas.
- Skills de iart-ai `web-animation-skills` movidos a `~/.agents/skills/iart-web-animation/` (60fps-animation, micro-interaction, accessible-animation).
- Links de GitHub/LinkedIn agregados.
- Checks pasan: `npm run lint`, `npx tsc --noEmit`, `npm run format:check`, `npm run build`.
- Añadido `vercel.json` con framework Vite, build command, output directory `dist` y SPA rewrite a `index.html`.
- Default branch renombrada de `master` a `main` en GitHub.
- Permiso de GitHub Actions activado para crear/aprobar pull requests; Release Please creó PR `chore(main): release portfolio 1.1.0`.
- Ruleset `mainrule` ajustado: administrador del repo puede hacer bypass de requisitos de revisión para mergear sus propios PRs.
- Metatags optimizados: título, descripción, autor, keywords, Open Graph, Twitter card y `theme-color`; título de pestaña ahora se actualiza según idioma.
- Sin historias de usuario aún; el backlog se construirá cuando se solicite.

## Kanban

### Backlog

_(vacío hasta que se solicite `/backlog`)_

### To Do

_(vacío)_

### In Progress

_(vacío)_

### Done

- Scaffold inicial: React + Vite + TypeScript, tooling y convenciones.
- Estructura de página de portafolio con secciones clave.

## Decisiones

- Sitio estático, sin backend.
- Contenido del portafolio es placeholder; el usuario debe reemplazarlo con datos reales.
- Estilo visual aún no definido; se mantendrá CSS mínimo hasta nueva indicación.

## Advertencias

- Nunca commitear, pushear ni abrir PR sin solicitud explícita.

## Próxima sesión sugerida

- Ejecutar `/backlog` para refinar estilo visual, tipografía y paleta; probar avatar en distintos viewports y ajustar comportamiento en móvil.
