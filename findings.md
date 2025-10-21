# flujo

## Pagina landing

❌ Desconectado del servidor index-CsM2JvtW.js:72:6260
El diseño fue forzado antes de que la página se cargara completamente. Si las hojas de estilo aún no se encuentran cargadas, esto podría causar que hayan artefactos en el contenido sin estilo. node.js:409:1
🌐 API Service - Configuración: index-XKstCi-6.js:72:5241
  📍 API_URL: https://cef71eaa6460.ngrok-free.app index-XKstCi-6.js:72:5288
  📍 Base URL completa: https://cef71eaa6460.ngrok-free.app/api index-XKstCi-6.js:72:5320
⏳ App - Mostrando pantalla de carga index-XKstCi-6.js:72:36429
🚀 App - Inicializando aplicación index-XKstCi-6.js:72:36192
🌐 App - API_URL: https://cef71eaa6460.ngrok-free.app index-XKstCi-6.js:72:36241
🔌 Socket - Inicializando conexión index-XKstCi-6.js:72:6921
  📍 URL: https://cef71eaa6460.ngrok-free.app index-XKstCi-6.js:72:6971
👤 App - Estado de usuario: null index-XKstCi-6.js:72:36339
⏳ App - Loading: true index-XKstCi-6.js:72:36384
👤 App - Estado de usuario: null index-XKstCi-6.js:72:36339
⏳ App - Loading: false index-XKstCi-6.js:72:36384
✅ Socket - Conectado al servidor index-XKstCi-6.js:72:7118
  🆔 Socket ID: v_3vfrjvch6xPH7KAAAJ index-XKstCi-6.js:72:7166

## Credenciales admin

🔐 Login - Intentando login de admin index-XKstCi-6.js:72:7729
👤 Login - Username: admin index-XKstCi-6.js:72:7781
📤 API Request - POST /auth/login index-XKstCi-6.js:72:5533
  🔑 Token presente: false index-XKstCi-6.js:72:5600
✅ API Response - POST /auth/login index-XKstCi-6.js:72:5720
  📦 Status: 200 index-XKstCi-6.js:72:5801
  📦 Data type: object index-XKstCi-6.js:72:5838
✅ Login - Admin login exitoso: 
Object { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzYxMDA5NTAyLCJleHAiOjE3NjEwOTU5MDJ9.-z7r3A799Df-DpddXRT4E7Io--AmE3nUo2UtjTzEKNE", role: "admin" }
index-XKstCi-6.js:72:7856
👤 App - Estado de usuario: 
Object { type: "admin", data: {…}, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzYxMDA5NTAyLCJleHAiOjE3NjEwOTU5MDJ9.-z7r3A799Df-DpddXRT4E7Io--AmE3nUo2UtjTzEKNE" }
index-XKstCi-6.js:72:36339
⏳ App - Loading: false index-XKstCi-6.js:72:36384
📤 API Request - GET /rounds index-XKstCi-6.js:72:5533
  🔑 Token presente: true index-XKstCi-6.js:72:5600
📤 API Request - GET /teams index-XKstCi-6.js:72:5533
  🔑 Token presente: true index-XKstCi-6.js:72:5600
✅ API Response - GET /rounds index-XKstCi-6.js:72:5720
  📦 Status: 200 index-XKstCi-6.js:72:5801
  📦 Data type: string index-XKstCi-6.js:72:5838
✅ API Response - GET /teams index-XKstCi-6.js:72:5720
  📦 Status: 200 index-XKstCi-6.js:72:5801
  📦 Data type: string index-XKstCi-6.js:72:5838
🔍 AdminDashboard - roundsRes: 
Object { data: '<!DOCTYPE html>\n<html class="h-full" lang="en-US" dir="ltr">\n  <head>\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Regular-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Medium-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Semibold-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-Text.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <meta charset="utf-8">\n    <meta name="author" content="ngrok">\n    <meta name="description" content="ngrok is the fastest way to put anything on the internet with a single command.">\n    <meta name="robots" content="noindex, nofollow">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link id="style" rel="stylesheet" href="https://cdn.ngrok.com/static/css/error.css">\n    <noscript>You are about to visit cef71eaa6460.ngrok-free.app, served by 190.46.107.73. This website is served for free through ngrok.com. You should only visit this website if you trust whoever sent the link to you. (ERR_NGROK_6024)</noscript>\n    <script id="script" src="https://cdn.ngrok.com/static/js/error.js" type="text/javascript"></script>\n  </head>\n  <body class="h-full" id="ngrok">\n    <div id="root" data-payload="eyJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI2MDI0IiwiaG9zdHBvcnQiOiJjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAiLCJtZXNzYWdlIjoiWW91IGFyZSBhYm91dCB0byB2aXNpdCBjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAsIHNlcnZlZCBieSAxOTAuNDYuMTA3LjczLiBUaGlzIHdlYnNpdGUgaXMgc2VydmVkIGZvciBmcmVlIHRocm91Z2ggbmdyb2suY29tLiBZb3Ugc2hvdWxkIG9ubHkgdmlzaXQgdGhpcyB3ZWJzaXRlIGlmIHlvdSB0cnVzdCB3aG9ldmVyIHNlbnQgdGhlIGxpbmsgdG8geW91LiIsInNlcnZpbmdJUCI6IjE5MC40Ni4xMDcuNzMiLCJ0aXRsZSI6Ik9LIn0="></div>\n  </body>\n</html>\n', status: 200, statusText: "", headers: {…}, config: {…}, request: XMLHttpRequest }
index-XKstCi-6.js:72:12757
🔍 AdminDashboard - teamsRes: 
Object { data: '<!DOCTYPE html>\n<html class="h-full" lang="en-US" dir="ltr">\n  <head>\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Regular-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Medium-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Semibold-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-Text.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <meta charset="utf-8">\n    <meta name="author" content="ngrok">\n    <meta name="description" content="ngrok is the fastest way to put anything on the internet with a single command.">\n    <meta name="robots" content="noindex, nofollow">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link id="style" rel="stylesheet" href="https://cdn.ngrok.com/static/css/error.css">\n    <noscript>You are about to visit cef71eaa6460.ngrok-free.app, served by 190.46.107.73. This website is served for free through ngrok.com. You should only visit this website if you trust whoever sent the link to you. (ERR_NGROK_6024)</noscript>\n    <script id="script" src="https://cdn.ngrok.com/static/js/error.js" type="text/javascript"></script>\n  </head>\n  <body class="h-full" id="ngrok">\n    <div id="root" data-payload="eyJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI2MDI0IiwiaG9zdHBvcnQiOiJjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAiLCJtZXNzYWdlIjoiWW91IGFyZSBhYm91dCB0byB2aXNpdCBjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAsIHNlcnZlZCBieSAxOTAuNDYuMTA3LjczLiBUaGlzIHdlYnNpdGUgaXMgc2VydmVkIGZvciBmcmVlIHRocm91Z2ggbmdyb2suY29tLiBZb3Ugc2hvdWxkIG9ubHkgdmlzaXQgdGhpcyB3ZWJzaXRlIGlmIHlvdSB0cnVzdCB3aG9ldmVyIHNlbnQgdGhlIGxpbmsgdG8geW91LiIsInNlcnZpbmdJUCI6IjE5MC40Ni4xMDcuNzMiLCJ0aXRsZSI6Ik9LIn0="></div>\n  </body>\n</html>\n', status: 200, statusText: "", headers: {…}, config: {…}, request: XMLHttpRequest }
index-XKstCi-6.js:72:12805
🔍 AdminDashboard - roundsRes.data: <!DOCTYPE html>
<html class="h-full" lang="en-US" dir="ltr">
  <head>
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Regular-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Medium-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Semibold-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-Text.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <meta charset="utf-8">
    <meta name="author" content="ngrok">
    <meta name="description" content="ngrok is the fastest way to put anything on the internet with a single command.">
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link id="style" rel="stylesheet" href="https://cdn.ngrok.com/static/css/error.css">
    <noscript>You are about to visit cef71eaa6460.ngrok-free.app, served by 190.46.107.73. This website is served for free through ngrok.com. You should only visit this website if you trust whoever sent the link to you. (ERR_NGROK_6024)</noscript>
    <script id="script" src="https://cdn.ngrok.com/static/js/error.js" type="text/javascript"></script>
  </head>
  <body class="h-full" id="ngrok">
    <div id="root" data-payload="eyJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI2MDI0IiwiaG9zdHBvcnQiOiJjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAiLCJtZXNzYWdlIjoiWW91IGFyZSBhYm91dCB0byB2aXNpdCBjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAsIHNlcnZlZCBieSAxOTAuNDYuMTA3LjczLiBUaGlzIHdlYnNpdGUgaXMgc2VydmVkIGZvciBmcmVlIHRocm91Z2ggbmdyb2suY29tLiBZb3Ugc2hvdWxkIG9ubHkgdmlzaXQgdGhpcyB3ZWJzaXRlIGlmIHlvdSB0cnVzdCB3aG9ldmVyIHNlbnQgdGhlIGxpbmsgdG8geW91LiIsInNlcnZpbmdJUCI6IjE5MC40Ni4xMDcuNzMiLCJ0aXRsZSI6Ik9LIn0="></div>
  </body>
</html>
index-XKstCi-6.js:72:12852
🔍 AdminDashboard - teamsRes.data: <!DOCTYPE html>
<html class="h-full" lang="en-US" dir="ltr">
  <head>
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Regular-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Medium-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Semibold-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-Text.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />
    <meta charset="utf-8">
    <meta name="author" content="ngrok">
    <meta name="description" content="ngrok is the fastest way to put anything on the internet with a single command.">
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link id="style" rel="stylesheet" href="https://cdn.ngrok.com/static/css/error.css">
    <noscript>You are about to visit cef71eaa6460.ngrok-free.app, served by 190.46.107.73. This website is served for free through ngrok.com. You should only visit this website if you trust whoever sent the link to you. (ERR_NGROK_6024)</noscript>
    <script id="script" src="https://cdn.ngrok.com/static/js/error.js" type="text/javascript"></script>
  </head>
  <body class="h-full" id="ngrok">
    <div id="root" data-payload="eyJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI2MDI0IiwiaG9zdHBvcnQiOiJjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAiLCJtZXNzYWdlIjoiWW91IGFyZSBhYm91dCB0byB2aXNpdCBjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAsIHNlcnZlZCBieSAxOTAuNDYuMTA3LjczLiBUaGlzIHdlYnNpdGUgaXMgc2VydmVkIGZvciBmcmVlIHRocm91Z2ggbmdyb2suY29tLiBZb3Ugc2hvdWxkIG9ubHkgdmlzaXQgdGhpcyB3ZWJzaXRlIGlmIHlvdSB0cnVzdCB3aG9ldmVyIHNlbnQgdGhlIGxpbmsgdG8geW91LiIsInNlcnZpbmdJUCI6IjE5MC40Ni4xMDcuNzMiLCJ0aXRsZSI6Ik9LIn0="></div>
  </body>
</html>
index-XKstCi-6.js:72:12910
✅ AdminDashboard - roundsData length: 0 index-XKstCi-6.js:72:13041
✅ AdminDashboard - teamsData length: 0 index-XKstCi-6.js:72:13103

​## Espectador

❌ Socket - Desconectado del servidor index-XKstCi-6.js:72:7229
El diseño fue forzado antes de que la página se cargara completamente. Si las hojas de estilo aún no se encuentran cargadas, esto podría causar que hayan artefactos en el contenido sin estilo. node.js:409:1
🌐 API Service - Configuración: index-XKstCi-6.js:72:5241
  📍 API_URL: https://cef71eaa6460.ngrok-free.app index-XKstCi-6.js:72:5288
  📍 Base URL completa: https://cef71eaa6460.ngrok-free.app/api index-XKstCi-6.js:72:5320
⏳ App - Mostrando pantalla de carga index-XKstCi-6.js:72:36429
🚀 App - Inicializando aplicación index-XKstCi-6.js:72:36192
🌐 App - API_URL: https://cef71eaa6460.ngrok-free.app index-XKstCi-6.js:72:36241
🔌 Socket - Inicializando conexión index-XKstCi-6.js:72:6921
  📍 URL: https://cef71eaa6460.ngrok-free.app index-XKstCi-6.js:72:6971
👤 App - Estado de usuario: null index-XKstCi-6.js:72:36339
⏳ App - Loading: true index-XKstCi-6.js:72:36384
👀 SpectatorView - Componente montado index-XKstCi-6.js:72:30560
📥 SpectatorView - Cargando datos... index-XKstCi-6.js:72:31511
👤 App - Estado de usuario: null index-XKstCi-6.js:72:36339
⏳ App - Loading: false index-XKstCi-6.js:72:36384
📤 API Request - GET /rounds index-XKstCi-6.js:72:5533
  🔑 Token presente: false index-XKstCi-6.js:72:5600
📤 API Request - GET /teams index-XKstCi-6.js:72:5533
  🔑 Token presente: false index-XKstCi-6.js:72:5600
✅ API Response - GET /rounds index-XKstCi-6.js:72:5720
  📦 Status: 200 index-XKstCi-6.js:72:5801
  📦 Data type: string index-XKstCi-6.js:72:5838
✅ API Response - GET /teams index-XKstCi-6.js:72:5720
  📦 Status: 200 index-XKstCi-6.js:72:5801
  📦 Data type: string index-XKstCi-6.js:72:5838
📦 SpectatorView - Respuesta rounds: 
Object { data: '<!DOCTYPE html>\n<html class="h-full" lang="en-US" dir="ltr">\n  <head>\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Regular-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Medium-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Semibold-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-Text.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <meta charset="utf-8">\n    <meta name="author" content="ngrok">\n    <meta name="description" content="ngrok is the fastest way to put anything on the internet with a single command.">\n    <meta name="robots" content="noindex, nofollow">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link id="style" rel="stylesheet" href="https://cdn.ngrok.com/static/css/error.css">\n    <noscript>You are about to visit cef71eaa6460.ngrok-free.app, served by 190.46.107.73. This website is served for free through ngrok.com. You should only visit this website if you trust whoever sent the link to you. (ERR_NGROK_6024)</noscript>\n    <script id="script" src="https://cdn.ngrok.com/static/js/error.js" type="text/javascript"></script>\n  </head>\n  <body class="h-full" id="ngrok">\n    <div id="root" data-payload="eyJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI2MDI0IiwiaG9zdHBvcnQiOiJjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAiLCJtZXNzYWdlIjoiWW91IGFyZSBhYm91dCB0byB2aXNpdCBjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAsIHNlcnZlZCBieSAxOTAuNDYuMTA3LjczLiBUaGlzIHdlYnNpdGUgaXMgc2VydmVkIGZvciBmcmVlIHRocm91Z2ggbmdyb2suY29tLiBZb3Ugc2hvdWxkIG9ubHkgdmlzaXQgdGhpcyB3ZWJzaXRlIGlmIHlvdSB0cnVzdCB3aG9ldmVyIHNlbnQgdGhlIGxpbmsgdG8geW91LiIsInNlcnZpbmdJUCI6IjE5MC40Ni4xMDcuNzMiLCJ0aXRsZSI6Ik9LIn0="></div>\n  </body>\n</html>\n', status: 200, statusText: "", headers: {…}, config: {…}, request: XMLHttpRequest }
index-XKstCi-6.js:72:31623
📦 SpectatorView - Respuesta teams: 
Object { data: '<!DOCTYPE html>\n<html class="h-full" lang="en-US" dir="ltr">\n  <head>\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Regular-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Medium-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Semibold-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-Text.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <meta charset="utf-8">\n    <meta name="author" content="ngrok">\n    <meta name="description" content="ngrok is the fastest way to put anything on the internet with a single command.">\n    <meta name="robots" content="noindex, nofollow">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link id="style" rel="stylesheet" href="https://cdn.ngrok.com/static/css/error.css">\n    <noscript>You are about to visit cef71eaa6460.ngrok-free.app, served by 190.46.107.73. This website is served for free through ngrok.com. You should only visit this website if you trust whoever sent the link to you. (ERR_NGROK_6024)</noscript>\n    <script id="script" src="https://cdn.ngrok.com/static/js/error.js" type="text/javascript"></script>\n  </head>\n  <body class="h-full" id="ngrok">\n    <div id="root" data-payload="eyJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI2MDI0IiwiaG9zdHBvcnQiOiJjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAiLCJtZXNzYWdlIjoiWW91IGFyZSBhYm91dCB0byB2aXNpdCBjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAsIHNlcnZlZCBieSAxOTAuNDYuMTA3LjczLiBUaGlzIHdlYnNpdGUgaXMgc2VydmVkIGZvciBmcmVlIHRocm91Z2ggbmdyb2suY29tLiBZb3Ugc2hvdWxkIG9ubHkgdmlzaXQgdGhpcyB3ZWJzaXRlIGlmIHlvdSB0cnVzdCB3aG9ldmVyIHNlbnQgdGhlIGxpbmsgdG8geW91LiIsInNlcnZpbmdJUCI6IjE5MC40Ni4xMDcuNzMiLCJ0aXRsZSI6Ik9LIn0="></div>\n  </body>\n</html>\n', status: 200, statusText: "", headers: {…}, config: {…}, request: XMLHttpRequest }
index-XKstCi-6.js:72:31677
✅ SpectatorView - Rounds cargadas: 0 index-XKstCi-6.js:72:31804
✅ SpectatorView - Teams cargados: 0 index-XKstCi-6.js:72:31863
⏸️ SpectatorView - No hay ronda activa index-XKstCi-6.js:72:32086
✅ Socket - Conectado al servidor index-XKstCi-6.js:72:7118
  🆔 Socket ID: Q-prnthYGt7l8PrHAAAL index-XKstCi-6.js:72:7166


## Equipo login

🔐 Login - Intentando login de equipo index-XKstCi-6.js:72:8105
🎯 Login - Token length: 32 index-XKstCi-6.js:72:8158
📤 API Request - POST /teams/login index-XKstCi-6.js:72:5533
  🔑 Token presente: false index-XKstCi-6.js:72:5600
✅ API Response - POST /teams/login index-XKstCi-6.js:72:5720
  📦 Status: 200 index-XKstCi-6.js:72:5801
  📦 Data type: object index-XKstCi-6.js:72:5838
✅ Login - Team login exitoso: 
Object { token: "c4d6e5d474e6b9c252f15aa817707b9b", team: {…} }
index-XKstCi-6.js:72:8241
🎯 TeamDashboard - Componente montado index-XKstCi-6.js:72:22455
👤 TeamDashboard - Usuario: 
Object { type: "team", data: {…}, token: "c4d6e5d474e6b9c252f15aa817707b9b" }
index-XKstCi-6.js:72:22508
🏆 TeamDashboard - Mi equipo: 
Object { id: 1, name: "Equipo Azul", color: "blue", balance: 10000 }
index-XKstCi-6.js:72:22553
📥 TeamDashboard - Cargando datos... index-XKstCi-6.js:72:23629
👤 App - Estado de usuario: 
Object { type: "team", data: {…}, token: "c4d6e5d474e6b9c252f15aa817707b9b" }
index-XKstCi-6.js:72:36339
⏳ App - Loading: false index-XKstCi-6.js:72:36384
📤 API Request - GET /rounds index-XKstCi-6.js:72:5533
  🔑 Token presente: true index-XKstCi-6.js:72:5600
📤 API Request - GET /teams index-XKstCi-6.js:72:5533
  🔑 Token presente: true index-XKstCi-6.js:72:5600
✅ API Response - GET /rounds index-XKstCi-6.js:72:5720
  📦 Status: 200 index-XKstCi-6.js:72:5801
  📦 Data type: string index-XKstCi-6.js:72:5838
✅ API Response - GET /teams index-XKstCi-6.js:72:5720
  📦 Status: 200 index-XKstCi-6.js:72:5801
  📦 Data type: string index-XKstCi-6.js:72:5838
📦 TeamDashboard - Respuesta rounds: 
Object { data: '<!DOCTYPE html>\n<html class="h-full" lang="en-US" dir="ltr">\n  <head>\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Regular-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Medium-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Semibold-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-Text.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <meta charset="utf-8">\n    <meta name="author" content="ngrok">\n    <meta name="description" content="ngrok is the fastest way to put anything on the internet with a single command.">\n    <meta name="robots" content="noindex, nofollow">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link id="style" rel="stylesheet" href="https://cdn.ngrok.com/static/css/error.css">\n    <noscript>You are about to visit cef71eaa6460.ngrok-free.app, served by 190.46.107.73. This website is served for free through ngrok.com. You should only visit this website if you trust whoever sent the link to you. (ERR_NGROK_6024)</noscript>\n    <script id="script" src="https://cdn.ngrok.com/static/js/error.js" type="text/javascript"></script>\n  </head>\n  <body class="h-full" id="ngrok">\n    <div id="root" data-payload="eyJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI2MDI0IiwiaG9zdHBvcnQiOiJjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAiLCJtZXNzYWdlIjoiWW91IGFyZSBhYm91dCB0byB2aXNpdCBjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAsIHNlcnZlZCBieSAxOTAuNDYuMTA3LjczLiBUaGlzIHdlYnNpdGUgaXMgc2VydmVkIGZvciBmcmVlIHRocm91Z2ggbmdyb2suY29tLiBZb3Ugc2hvdWxkIG9ubHkgdmlzaXQgdGhpcyB3ZWJzaXRlIGlmIHlvdSB0cnVzdCB3aG9ldmVyIHNlbnQgdGhlIGxpbmsgdG8geW91LiIsInNlcnZpbmdJUCI6IjE5MC40Ni4xMDcuNzMiLCJ0aXRsZSI6Ik9LIn0="></div>\n  </body>\n</html>\n', status: 200, statusText: "", headers: {…}, config: {…}, request: XMLHttpRequest }
index-XKstCi-6.js:72:23804
📦 TeamDashboard - Respuesta teams: 
Object { data: '<!DOCTYPE html>\n<html class="h-full" lang="en-US" dir="ltr">\n  <head>\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Regular-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Medium-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-Semibold-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-Text.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <link rel="preload" href="https://cdn.ngrok.com/static/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff" as="font" type="font/woff" crossorigin="anonymous" />\n    <meta charset="utf-8">\n    <meta name="author" content="ngrok">\n    <meta name="description" content="ngrok is the fastest way to put anything on the internet with a single command.">\n    <meta name="robots" content="noindex, nofollow">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link id="style" rel="stylesheet" href="https://cdn.ngrok.com/static/css/error.css">\n    <noscript>You are about to visit cef71eaa6460.ngrok-free.app, served by 190.46.107.73. This website is served for free through ngrok.com. You should only visit this website if you trust whoever sent the link to you. (ERR_NGROK_6024)</noscript>\n    <script id="script" src="https://cdn.ngrok.com/static/js/error.js" type="text/javascript"></script>\n  </head>\n  <body class="h-full" id="ngrok">\n    <div id="root" data-payload="eyJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI2MDI0IiwiaG9zdHBvcnQiOiJjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAiLCJtZXNzYWdlIjoiWW91IGFyZSBhYm91dCB0byB2aXNpdCBjZWY3MWVhYTY0NjAubmdyb2stZnJlZS5hcHAsIHNlcnZlZCBieSAxOTAuNDYuMTA3LjczLiBUaGlzIHdlYnNpdGUgaXMgc2VydmVkIGZvciBmcmVlIHRocm91Z2ggbmdyb2suY29tLiBZb3Ugc2hvdWxkIG9ubHkgdmlzaXQgdGhpcyB3ZWJzaXRlIGlmIHlvdSB0cnVzdCB3aG9ldmVyIHNlbnQgdGhlIGxpbmsgdG8geW91LiIsInNlcnZpbmdJUCI6IjE5MC40Ni4xMDcuNzMiLCJ0aXRsZSI6Ik9LIn0="></div>\n  </body>\n</html>\n', status: 200, statusText: "", headers: {…}, config: {…}, request: XMLHttpRequest }
index-XKstCi-6.js:72:23858
✅ TeamDashboard - Rounds cargadas: 0 index-XKstCi-6.js:72:23985
✅ TeamDashboard - Teams cargados: 0 index-XKstCi-6.js:72:24044
⏸️ TeamDashboard - No hay ronda activa index-XKstCi-6.js:72:24267

​

