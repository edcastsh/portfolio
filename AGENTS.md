# Portfolio — guía para agentes

Proyecto React + Vite + TypeScript. Sitio estático sin backend.

## Desarrollo (metodología hola-ai)

Usamos el flujo XP `backlog → story → pair` de [hola-ai](https://github.com/nschurmann/hola-ai). Los skills viven en `~/.agents/skills/` (`backlog`, `story`, `pair`) y se invocan solo cuando el usuario lo pide; no correr automáticamente.

**Flujo**

1. **`backlog`** — convertir una idea en 10–15 historias verticales de una línea. Sin criterios de aceptación, historias técnicas, estimaciones ni requisitos inventados. Preguntar la información faltante de a una pregunta a la vez, con respuesta sugerida. La primera historia es el esqueleto caminante más pequeño. El tracker es el Kanban de `PROJECT_CONTEXT.md`; agregar historias solo cuando el usuario lo pida.
2. **`story`** — refinar UNA historia: 2–3 criterios Given/When/Then (si se necesitan más, proponer dividir), plan de ≤5 bullets, fuera de alcance y sugerencias opcionales solo si hay una señal concreta en el código. No escribir código. Esperar aprobación explícita.
3. **`pair`** — implementar una historia. Leer la historia, `PROJECT_CONTEXT.md` y el código relevante. Proponer lista de pruebas (nombres + dónde se prueba; marcar checks visuales/manuales). Esperar aprobación, luego un ciclo: escribir prueba → mostrar rojo → código mínimo → mostrar verde. Parar tras un ciclo salvo que el usuario pida N; para N, mostrar todas las pruebas primero, luego el código. Nunca cambiar, saltar o borrar una prueba para forzar verde.

**Parar inmediatamente si**

- El paso necesita una decisión de diseño que no está en el plan.
- Se piensa en agregar algo que el usuario no pidió.
- Hacer pasar una prueba requiere cambiar, saltar o borrar una prueba.
- Dos intentos fallan en llegar a verde.
- El paso supera ~50 líneas o toca más de 3 archivos: proponer dividirlo.

**Reglas de pruebas**

- Los valores esperados vienen de los criterios de aceptación, nunca de la misma lógica de la implementación.
- Probar comportamiento a través de la interfaz pública, no detalles internos.

**Después de verde**

- Verificar con el usuario los criterios marcados como verificación manual.
- Sugerir `/code-review` con contexto limpio; no auto-revisar.
- Sugerir refactors solo con pruebas verdes, nunca mezclados con funcionalidad nueva.
- Correr `npm run lint`, `npx tsc --noEmit` y `npm run format:check`.
- Actualizar `PROJECT_CONTEXT.md` (estado, Kanban, decisiones, próxima sesión).
- Nunca commitear, pushear ni abrir PR salvo que se pida explícitamente.

## Comandos

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run lint      # eslint .
npm run format    # prettier --write .
npm run format:check   # prettier --check .
npm run typecheck # tsc --noEmit
```

Antes de declarar una tarea terminada, correr y pasar: `npm run lint`, `npx tsc --noEmit` y `npm run format:check`.

## Contexto y flujo de trabajo

- `PROJECT_CONTEXT.md` es el tablero vivo: estado actual, Kanban, decisiones y advertencias. Leerlo al inicio de cada sesión y actualizarlo al final de cada actividad.
- Al terminar una actividad, mover la tarea a la columna correcta del Kanban (`Done` si está completa, `In Progress` si falta merge/validación), registrar commit/PR/bloqueadores y refrescar la sección **Próxima sesión sugerida**.
- Nunca commitear, pushear ni abrir PR salvo que se pida explícitamente.
- Después de mergear un PR a `main`: `git checkout main && git pull origin main`, luego crear la nueva rama desde `main` actualizado. No seguir trabajando en la rama mergeada ni hacer force-push.

## Convención de ramas

Validada por Husky en `pre-push`:

```
(feat|feature|fix|hotfix|chore|refactor|docs|release)/[PROYECTO-1234-]descripcion-corta
```

Ramas protegidas: `main`, `stage`, `development`, `develop_v2`.

## Versionado

Release Please se ejecuta vía GitHub Actions al pushear a `main`. Config: `release-please-config.json`, manifest: `.release-please-manifest.json`.
