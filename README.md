# Spotify Mixer - Generador de Playlists Inteligente

Una aplicación web interactiva construida con **Next.js** y **Tailwind CSS** que permite generar playlists de Spotify personalizadas basándose en estados de ánimo, décadas, popularidad y gustos musicales específicos.

![Pagina Principal](spotify-taste-mixer/public/screenshot1.png)
![Favoritos](spotify-taste-mixer/public/screenshot2.png)
![Playlist guardadas](spotify-taste-mixer/public/screenshot3.png)


## Características Principales

### Mixer & Widgets
Un panel de control completo para filtrar música:
* **Artistas y Géneros:** Selección múltiple para definir la base de la búsqueda.
* **Mood Widget:** Algoritmo personalizado que traduce parámetros de audio (Energía, Positividad, Bailabilidad) en géneros musicales compatibles (ej: *Energía Alta* -> *Rock/EDM*).
* **Widget de Popularidad:** Filtra desde música *Underground* hasta el *Top 50 Mundial*.
* **Filtro por Décadas:** Viaja en el tiempo seleccionando épocas específicas (80s, 90s, 00s...).

### Gestión de Playlists (Local)
* **Generación Inteligente:** Algoritmo que mezcla resultados de diferentes fuentes (artistas, géneros y mood) para crear una lista variada.
* **Mis Playlists:** Sistema de guardado persistente utilizando `localStorage`. Crea, nombra y gestiona tus listas favoritas sin necesidad de base de datos.
* **Favoritos:** Marca canciones individuales para guardarlas en tu biblioteca personal.

### UI/UX Moderna
* Diseño **Responsive** y oscuro (Dark Mode nativo).
* Barras de desplazamiento personalizadas (estilo Spotify).
* Interfaz flexible con **Sticky Headers** y áreas de scroll independiente.

## Stack Tecnológico

* **Framework:** [Next.js 14/15](https://nextjs.org/) (App Router)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Estado:** React Hooks (`useState`, `useEffect`, `localStorage`).
* **Iconos:** Emojis nativos y CSS puro.

## Cómo funciona el algoritmo de Mood

Dado que la API de búsqueda estándar no permite filtrar por "audio features" (energía, valencia) directamente, la aplicación utiliza una **lógica de mapeo inteligente**:

1.  El usuario ajusta los sliders (0-100%).
2.  El sistema traduce estos valores a "Géneros Fantasma".
    * *Ejemplo:* Si `Energía > 80%`, se añade internamente `rock` y `edm` a la búsqueda.
    * *Ejemplo:* Si `Positividad < 20%`, se añade `sad` y `piano`.
3.  Se combinan estos resultados con los artistas seleccionados para garantizar que la playlist final coincida con la "vibe" del usuario.

## Estructura del Proyecto

```text
src/
├── app/
│   ├── api/
│   │   ├── refresh-token/   # Endpoint para renovar sesión
│   │   └── spotify-token/   # Endpoint para obtener token inicial
│   ├── auth/callback/       # Redirección tras login de Spotify
│   ├── dashboard/           # Página principal (El Mixer)
│   ├── globals.css          # Estilos globales y custom scrollbar
│   └── layout.js            # Layout raíz
├── components/
│   ├── widgets/             # Componentes de filtrado aislados
│   │   ├── ArtistWidget.jsx
│   │   ├── DecadeWidget.jsx
│   │   ├── GenreWidget.jsx
│   │   ├── MoodWidget.jsx
│   │   ├── PopularityWidget.jsx
│   │   └── TrackWidget.jsx
│   ├── Favorites.jsx        # Vista de canciones favoritas
│   ├── Header.jsx           # Navegación superior
│   ├── MyPlaylists.jsx      # Vista de listas guardadas (LocalStorage)
│   ├── PlaylistDisplay.jsx  # Componente visualizador de resultados
│   └── TrackModal.jsx       # Modal de detalles de canción
└── lib/
    ├── auth.js              # Lógica de gestión de tokens y sesiones
    └── spotify.js           # Motor de búsqueda y algoritmo de generación
