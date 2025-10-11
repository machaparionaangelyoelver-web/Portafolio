
# Portafolio Electrónico — GitHub Pages

Estructura solicitada: **Portada**, **Sobre mí**, **Proyectos (concluidos)**, **Cuaderno** (semanas),
**Reflexión final** y **Bibliografía**.

## Cómo publicar
1. Cambia `tuusuario` por tu usuario real en los enlaces de `data/*.json` y en la portada.
2. Crea un repositorio llamado **tuusuario.github.io** (debe coincidir con tu usuario de GitHub).
3. Sube todos los archivos de esta carpeta a ese repositorio (arrastrar y soltar en GitHub o usar Git).
4. Ve a **Settings ▸ Pages** y deja la fuente en `Deploy from a branch` (main / root).
5. Abre `https://tuusuario.github.io` y listo.

## Editar contenido
- `data/proyectos.json`: añade proyectos y marca `estado` como `En curso` o `Concluido`.
- `data/cuaderno.json`: agrega objetos por semana con `numero`, `temas`, `ejercicios`, `reflexion`.
- `data/bibliografia.json`: agrega tus fuentes (autor, año, título, url).
- `assets/portada-ejemplo.jpg`: reemplaza por tu propia imagen (mismo nombre).
- Textos fijos en `*.html` puedes editarlos directamente.

## Estructura
- `index.html` (Portada) + métricas que se alimentan de `data/estadisticas.json`.
- `sobre-mi.html` (biografía).
- `proyectos.html` (lee `data/proyectos.json`).
- `cuaderno.html` (lista de semanas de `data/cuaderno.json`).
- `bibliografia.html` (reflexión y referencias desde `data/bibliografia.json`).
- `assets/style.css` (estilos).

## Buenas prácticas
- Commits pequeños con mensajes claros.
- Incluye capturas o GIFs en `assets/` para evidencias de proyecto.
- Usa ramas para cambios grandes y haz Pull Requests (aunque seas tú mismo).
