/*
? Buenas prácticas para mensajes de commits usando Conventional Commits

Usar "Conventional Commits" es una de las mejores formas de estructurar los mensajes de commit. Esto ayuda a mantener el historial del repositorio limpio, predecible y fácil de analizar. Además, es útil para herramientas de integración continua, generación automática de changelogs, y facilitar la colaboración entre equipos.

* *Reglas básicas:* *
- El mensaje se compone de: <tipo>[alcance opcional]: <descripción>
- La descripción debe ser clara y en tiempo presente (imperativo).
- Opcionalmente, puedes incluir líneas adicionales para detalles o referencias.

* *Tipos más comunes:**
- feat: Una nueva funcionalidad para el usuario.
- fix: Corrección de errores.
- docs: Cambios en la documentación.
- style: Cambios de formato (espacios, comas, puntos y coma, etc), sin afectar la lógica.
- refactor: Cambios de código que no corrigen errores ni agregan funcionalidades.
- test: Añadir o modificar pruebas.
- chore: Tareas de mantenimiento del proyecto, como cambios en la configuración.

**Ejemplo:**
Agrega una nueva funcionalidad al login:
feat(login): permite login con Google

Corrige un bug en el sistema de pagos:
fix(payment): arregla error al procesar tarjetas vencidas

Cambios en la documentación:
docs(readme): añade instrucciones para la instalación

Más información: https://www.conventionalcommits.org/es/v1.0.0/
*/
