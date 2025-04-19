# 🛍️ react-ecommerce-basic

_Ecommerce básico construido con React + TypeScript, Vite y Express._

Este proyecto es una plantilla simple para una aplicación de comercio
electrónico construida. El frontend está construido con **React** + **Vite** y
el backend con **Express** en **TypeScript**, utilizando `drizzle-orm` para la
gestión de la base de datos.

## 🚀 Características

- ⚛️ Frontend moderno con React + Vite
- 📦 Backend ligero con Express y TypeScript
- 💅 Estilos con TailwindCSS
- 🔐 Configuración para variables de entorno
- 🛠️ Build optimizado con ESBuild
- 🗃️ ORM ligero con Drizzle
- 🖼️ Soporte para assets e imágenes

## 📁 Estructura del proyecto

```
react-ecommerce-basic/
├── client/                # Frontend (React + Vite)
│   ├── public/            # Archivos estáticos
│   └── src/               # Código fuente del cliente
├── server/                # Backend (Express)
│   ├── index.ts           # Punto de entrada del servidor
│   ├── routes.ts          # Rutas API
│   ├── storage.ts         # Lógica de almacenamiento
│   └── vite.ts            # Configuración de Vite SSR
├── shared/                # Código compartido (ej: esquemas DB)
│   └── schema.ts
├── public/                # Assets públicos
│   └── assets/
├── attached_assets/       # Imágenes y otros recursos
├── drizzle.config.ts      # Configuración de Drizzle ORM
├── tailwind.config.ts     # Configuración de TailwindCSS
├── vite.config.ts         # Configuración de Vite
├── tsconfig.json          # Configuración de TypeScript
├── .env.example           # Variables de entorno de ejemplo
└── package.json
```

## 🧪 Scripts disponibles

```bash
# Iniciar el servidor en desarrollo
npm run dev

# Compilar el proyecto para producción
npm run build

# Iniciar en modo producción
npm start

# Verificar errores de TypeScript
npm run check

# Aplicar migraciones con Drizzle
npm run db:push
```

## ⚙️ Requisitos

- Node.js 18+
- npm o pnpm
- Base de datos compatible (PostgreSQL)

## 🛠️ Ejecutar el proyecto localmente

### 1. Clona el repositorio

```bash
git clone https://github.com/JacuXx/react-ecommerce-basic.git
cd react-ecommerce-basic
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Copia el archivo `.env.example` como `.env` y configura los valores necesarios:

```bash
cp .env.example .env
```

> Asegúrate de configurar correctamente los datos de tu base de datos si estás usando Drizzle ORM.

### 4. Ejecuta el servidor en modo desarrollo

```bash
npm run dev
```

Esto iniciará el servidor backend con Express y también el cliente con Vite en
desarrollo.

Puedes acceder a la aplicación en:

```
http://localhost:5001
```

## 🛡️ Seguridad

Consulta [SECURITY.md](./SECURITY.md) para conocer las políticas de seguridad del proyecto.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
