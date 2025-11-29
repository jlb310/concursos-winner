# Sorteos Instagram Pro

Una aplicación web moderna y elegante para realizar sorteos de Instagram.

## Características

- ✨ **Diseño Premium**: Interfaz oscura con gradientes, glassmorphism y animaciones fluidas.
- 🚀 **Flujo Completo**: Desde ingresar la URL hasta celebrar al ganador.
- 🎲 **Selección Justa**: Algoritmo de selección aleatoria (simulado en esta demo).
- 🏆 **Resultados Claros**: Muestra 1 ganador principal y 3 alternativas.
- 📱 **Responsive**: Funciona perfectamente en móviles y escritorio.

## Cómo usar

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Nota sobre la API de Instagram

Actualmente, la aplicación funciona en **modo demostración**. Debido a las estrictas limitaciones de la API de Instagram, obtener comentarios reales requiere:
1. Una cuenta de Instagram Business.
2. Permisos de Facebook Developer aprobados.
3. Autenticación del usuario (Login con Facebook).

Esta versión simula la obtención de datos para mostrar la experiencia de usuario (UX) y el diseño final. Para conectar datos reales, se necesitaría integrar la *Instagram Graph API* o un servicio de scraping de terceros.
