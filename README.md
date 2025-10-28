# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.












📘 Política de Dependencias, Actualización Gradual y Documentación

Proyecto: Sistema de Gestión de Biblioteca (Frontend + Backend)

🧩 Estrategia 5: Documentación de Dependencias y Justificación

Descripción:
Mantener un registro claro del propósito, uso y justificación de cada dependencia incorporada en el proyecto.
Esto permite comprender por qué se eligió cada paquete, cómo se usa y facilita el mantenimiento, actualización y auditoría del sistema.

📚 DEPENDENCY-DOCS.md
🖥️ Dependencias del Frontend

Framework base: React 18.3.1 + Vite 6.2.0

Producción
axios (1.11.0)

Propósito: Cliente HTTP para comunicación con el backend.

Alternativas consideradas: fetch nativo, superagent.

Justificación: Ofrece interceptores, cancelación de peticiones y un manejo robusto de errores.

Usado en:

src/api/axiosConfig.js

src/api/*.js

bootstrap (5.3.3)

Propósito: Framework CSS para diseño responsive y componentes visuales.

Alternativas consideradas: Tailwind, Material UI.

Justificación: Amplio soporte, fácil integración y coherencia visual en el diseño.

Usado en:

Componentes y páginas del frontend.

bootstrap-icons (1.11.3)

Propósito: Conjunto de íconos SVG optimizados para Bootstrap.

Alternativas consideradas: FontAwesome, Heroicons.

Justificación: Ligereza, coherencia visual y compatibilidad directa con Bootstrap.

react (18.3.1)

Propósito: Biblioteca principal para construcción de interfaces dinámicas.

Justificación: Amplio ecosistema, comunidad activa y compatibilidad con Vite.

Usado en:

Todo el árbol de componentes del proyecto.

react-dom (18.3.1)

Propósito: Renderizado del árbol de componentes React al DOM.

Justificación: Esencial para el funcionamiento de React.

react-router-dom (7.5.1)

Propósito: Manejo de rutas y navegación SPA (Single Page Application).

Alternativas: Next.js Router, Wouter.

Justificación: Simplifica la navegación y el control de rutas protegidas.

Usado en:

src/App.jsx

src/pages/*

zustand (5.0.3)

Propósito: Gestión de estado global.

Alternativas consideradas: Redux, Context API, Jotai.

Justificación: API simple, sin boilerplate y con excelente rendimiento.

Usado en:

src/store/*.js

src/hooks/*.js

Desarrollo
eslint (9.21.0)

Propósito: Análisis estático de código y control de calidad.

Configuración: eslint.config.js

Plugins: react, react-hooks, react-refresh

vite (6.2.0)

Propósito: Herramienta moderna de build y servidor de desarrollo.

Justificación: Alta velocidad de compilación, soporte para HMR (Hot Module Replacement).

serve (14.2.4)

Propósito: Servidor estático para pruebas de compilaciones.

Usado en: Comando npm run preview.

@vitejs/plugin-react (4.3.4)

Propósito: Compatibilidad entre React y Vite.

Justificación: Soporte oficial y actualizado de JSX, Fast Refresh, y React 18.

🧰 Dependencias del Backend

Entorno: Node.js + Express + Firebase

Producción
express (5.1.0)

Propósito: Framework backend para manejo de rutas, middlewares y API REST.

Alternativas: Fastify, Koa.

Justificación: Ecosistema maduro, soporte amplio y documentación estable.

Usado en: src/index.js, src/routes/*.

firebase-admin (13.4.0)

Propósito: Integración con Firestore, Authentication y servicios de Firebase.

Configuración: src/config/firebase.js.

Justificación: SDK oficial con soporte continuo y compatibilidad total.

dotenv (17.2.1)

Propósito: Cargar variables de entorno desde .env.

Justificación: Estandar en configuración segura y portable de Node.js.

cors (2.8.5)

Propósito: Control de acceso entre dominios (CORS).

Justificación: Facilita la comunicación entre frontend y backend en distintos orígenes.

jsonwebtoken (9.0.2)

Propósito: Generación y verificación de tokens JWT para autenticación.

Alternativas: jose, passport-jwt.

Usado en: src/middleware/auth.js.

express-rate-limit (8.0.1)

Propósito: Limitación de peticiones por IP para evitar abuso.

Justificación: Mejora la seguridad frente a ataques de fuerza bruta.

bcryptjs (3.0.2)

Propósito: Encriptación de contraseñas.

Alternativas: bcrypt, argon2.

Justificación: Ligero, multiplataforma y sin dependencias nativas.

morgan (1.10.1)

Propósito: Middleware de logging de peticiones HTTP.

Justificación: Permite auditar solicitudes y depurar con facilidad.

Desarrollo
nodemon (3.1.10)

Propósito: Reinicio automático del servidor al detectar cambios.

Usado en: npm run dev.

🧯 Vulnerabilidades Conocidas

Ejecutar npm audit periódicamente y registrar los resultados.

Última auditoría: 2025-01-20
Vulnerabilidades críticas: 0
Vulnerabilidades altas: 0

🔄 Estrategia 6: Actualización Gradual y Testing

Descripción:
Proceso estructurado para actualizar dependencias de forma controlada, minimizando riesgos y verificando compatibilidad mediante pruebas.

Proceso Recomendado
# 1️⃣ Crear rama para actualización
git checkout -b deps/actualizacion-mensual-enero-2025

# 2️⃣ Verificar dependencias obsoletas
npm outdated

# 3️⃣ Actualizar dependencias menores (bajo riesgo)
npm update

# 4️⃣ Actualizar dependencias mayores (una por vez)
npm install react@latest react-dom@latest

# 5️⃣ Ejecutar tests
npm test

# 6️⃣ Verificar funcionamiento local
npm run dev

# 7️⃣ Generar build de producción
npm run build

# 8️⃣ Commit y Pull Request
git add package.json package-lock.json
git commit -m "chore: actualizar dependencias enero 2025"
git push origin deps/actualizacion-mensual-enero-2025

✅ Checklist – Actualización de Dependencias
Pre-actualización

 Backup de la rama actual

 Revisar changelog de las librerías

 Analizar breaking changes

Durante la actualización

 Actualizar una dependencia a la vez

 Ejecutar npm install

 Revisar warnings y conflictos

 Ejecutar suite de tests

Post-actualización

 Probar entorno de desarrollo

 Compilar versión de producción

 Testear funciones críticas manualmente

 Actualizar documentación

 Crear PR para revisión del equipo

🧱 Estrategia 7: Política de Deprecación de Dependencias

Descripción:
Define criterios claros para determinar cuándo mantener, revisar o reemplazar dependencias obsoletas o inseguras.

Criterios para Mantener una Dependencia ✅

Última actualización hace menos de 12 meses.

Sin vulnerabilidades críticas o altas.

Mantenedor activo (commits recientes).

Issues resueltos de forma continua.

Documentación actualizada.

Compatible con versiones actuales de Node/React.

Criterios para Revisar ⚠️

Última actualización mayor a 12 meses.

Vulnerabilidades moderadas o dependencias inactivas.

Existencia de alternativas modernas.

Incremento excesivo en el tamaño del bundle.

Criterios para Deprecar ❌

Proyecto abandonado (sin updates por más de 24 meses).

Vulnerabilidades críticas sin parche.

Incompatibilidad con versiones actuales.

Mejor alternativa estable y documentada disponible.

📅 Última revisión general: Octubre 2025
📋 Responsable: Sebastián Panozzo
🔒 Repositorio: Biblioteca-Frontend / Biblioteca-Backend













