# Planilla de Asistencias Zapataye FC

## Descripción

Aplicación web progresiva (PWA) para gestionar la asistencia y los pagos mensuales de jugadores de los equipos masculino y femenino de Zapataye FC. Permite llevar un registro detallado por mes, visualizar rankings, estados de pago y gestionar la lista de jugadores y los días de entrenamiento.

## Arquitectura del Proyecto

### Frontend (React + Vite)
- **Framework:** React 19 con Hooks
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS + Material Tailwind + Bootstrap
- **Routing:** React Router DOM
- **Autenticación:** Google OAuth + JWT
- **Notificaciones:** SweetAlert2
- **Iconos:** React Icons
- **PWA:** Instalable en dispositivos móviles y escritorio

### Backend (Node.js + Express)
- **Runtime:** Node.js con ES Modules
- **Framework:** Express.js
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** JWT
- **CORS:** Habilitado para desarrollo
- **Variables de Entorno:** dotenv

## Funcionalidades Principales

### Gestión de Jugadores
- **Agregar:** Añade nuevos jugadores a la lista maestra y a las planillas mensuales
- **Eliminar:** Elimina jugadores de la lista maestra y de todas las planillas
- **Editar:** Modifica información de jugadores
- **Separación por Equipos:** Gestión independiente para equipos masculino y femenino

### Gestión de Asistencias
- **Vista Mensual:** Tabla con jugadores y días de entrenamiento del mes seleccionado
- **Registro de Asistencia:** Marcar/desmarcar asistencia de cada jugador
- **Suspensión de Entrenamientos:** Marcar días como suspendidos (no cuentan para estadísticas)

### Gestión de Pagos
- **Registro de Pagos:** Marcar/desmarcar estado del pago mensual
- **Estado de Pagos:** Lista de jugadores con meses pendientes de pago

### Gestión de Entrenamientos
- **Agregar Fecha:** Añadir nueva fecha de entrenamiento al mes actual
- **Eliminar Fecha:** Eliminar fecha de entrenamiento existente
- **Orden Cronológico:** Las fechas se insertan automáticamente en orden

### Reportes y Estadísticas
- **Ranking de Asistencia:** Ranking general ordenado por mayor asistencia
- **Consideraciones:** Solo fechas pasadas/presentes, excluye días suspendidos
- **Navegación por Meses:** Selección de diferentes meses disponibles

### Fixture
- **Gestión de Partidos:** Programación y seguimiento de partidos
- **Información de Rivales:** Datos de equipos contrarios

## Estructura del Proyecto

```
entrenamientos-zapa2025/
├── backend/                 # Servidor Node.js + Express
│   ├── controllers/         # Lógica de negocio
│   │   ├── femenino/       # Controllers para equipo femenino
│   │   └── ...             # Controllers para equipo masculino
│   ├── routes/             # Definición de rutas API
│   │   ├── femenino/       # Rutas para equipo femenino
│   │   └── ...             # Rutas para equipo masculino
│   ├── services/           # Servicios (Supabase client)
│   ├── middleware/         # Middlewares personalizados
│   ├── index.js           # Punto de entrada del servidor
│   └── package.json       # Dependencias del backend
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── services/          # Servicios del frontend
│   ├── assets/            # Recursos estáticos
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Punto de entrada
├── public/                # Archivos públicos
└── package.json          # Dependencias del frontend
```

## API Endpoints

### Equipo Masculino
- `GET /api/players` - Obtener jugadores
- `POST /api/players` - Crear jugador
- `PUT /api/players/:id` - Actualizar jugador
- `DELETE /api/players/:id` - Eliminar jugador
- `GET /api/attendance` - Obtener asistencias
- `POST /api/attendance` - Registrar asistencia
- `GET /api/trainings` - Obtener entrenamientos
- `POST /api/trainings` - Crear entrenamiento
- `GET /api/payments` - Obtener pagos
- `POST /api/payments` - Registrar pago
- `GET /api/ranking` - Obtener ranking

### Equipo Femenino
- `GET /api/femenino/players` - Obtener jugadoras
- `POST /api/femenino/players` - Crear jugadora
- `PUT /api/femenino/players/:id` - Actualizar jugadora
- `DELETE /api/femenino/players/:id` - Eliminar jugadora
- `GET /api/femenino/attendance` - Obtener asistencias
- `POST /api/femenino/attendance` - Registrar asistencia
- `GET /api/femenino/trainings` - Obtener entrenamientos
- `POST /api/femenino/trainings` - Crear entrenamiento
- `GET /api/femenino/payments` - Obtener pagos
- `POST /api/femenino/payments` - Registrar pago
- `GET /api/femenino/ranking` - Obtener ranking

### Fixture
- `GET /api/fixture` - Obtener fixture
- `POST /api/fixture` - Crear partido
- `PUT /api/fixture/:id` - Actualizar partido
- `DELETE /api/fixture/:id` - Eliminar partido

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Supabase

### Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Editar `.env` con las credenciales de Supabase:
```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
PORT=3001
```

5. Iniciar el servidor:
```bash
npm start
# o para desarrollo
npm run dev
```

### Configuración del Frontend

1. En el directorio raíz del proyecto:
```bash
npm install
```

2. Configurar la URL de la API en `src/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

4. Construir para producción:
```bash
npm run build
```

## Características Técnicas

### Frontend
- **Responsive Design:** Adaptable a diferentes tamaños de pantalla
- **PWA:** Instalable como aplicación nativa
- **Autenticación:** Integración con Google OAuth
- **Estado Global:** Context API para gestión de estado
- **Testing:** Vitest para pruebas unitarias

### Backend
- **RESTful API:** Endpoints bien estructurados
- **Validación:** Middleware de validación de datos
- **Error Handling:** Manejo centralizado de errores
- **CORS:** Configurado para desarrollo y producción
- **Modular:** Arquitectura modular con separación de responsabilidades

### Base de Datos
- **Supabase:** PostgreSQL como servicio
- **Relaciones:** Tablas relacionadas para jugadores, asistencias, pagos, etc.
- **Seguridad:** Row Level Security (RLS) habilitado
- **Backup:** Automático con Supabase

## Despliegue

### Backend
El backend puede desplegarse en:
- Render
- Heroku
- Railway
- Vercel (con adaptaciones)

### Frontend
El frontend puede desplegarse en:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Autor

**Matias Gonzalez Autelli**
- Email: matutegon97@gmail.com
- GitHub: [@matutegon97](https://github.com/matutegon97)

## Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.