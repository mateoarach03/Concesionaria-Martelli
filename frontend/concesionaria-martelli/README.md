# Frontend - Concesionaria Martelli

Sistema web de gestión de inventario con autenticación admin.

## Arquitectura

```
frontend/concesionaria-martelli/src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts          # Gestión de autenticación
│   │   └── vehicle.service.ts       # CRUD de vehículos
│   ├── guards/
│   │   └── admin.guard.ts           # Protección de rutas admin
│   ├── models/
│   │   └── vehicle.ts               # Interfaz de vehículo
│   ├── components/
│   │   ├── home/                    # Página de inicio (pública)
│   │   ├── vehiculos/               # Listado de vehículos (pública)
│   │   ├── vehiculo-detalle/        # Detalle de vehículo (pública)
│   │   ├── quienes-somos/           # Quiénes somos (pública)
│   │   ├── login/                   # Formulario de login
│   │   ├── admin/                   # Panel de administración
│   │   ├── navbar/                  # Barra de navegación
│   │   └── footer/                  # Pie de página
│   ├── app.routes.ts                # Definición de rutas
│   ├── app.ts                       # Componente raíz
│   └── app.config.ts                # Configuración global
├── environments/
│   ├── environment.ts               # Producción
│   └── environment.development.ts   # Desarrollo
└── main.ts                          # Punto de entrada
```

## Servicios

### AuthService
Gestiona la autenticación con Supabase.

```typescript
// Métodos principales
login(email: string, password: string)  // Inicia sesión
logout()                                 // Cierra sesión
isLoggedIn(): boolean                    // Verifica si está logueado
isAdmin(): boolean                       // Verifica si es admin
getCurrentUser(): AuthUser | null        // Obtiene usuario actual
getAccessToken(): string | null          // Obtiene token

// Observables
session$: Observable<Session | null>     // Cambios de sesión
user$: Observable<AuthUser | null>       // Cambios de usuario
```

### VehicleService
Gestiona vehículos desde Supabase.

```typescript
// Métodos principales
getAllVehicles()                         // Obtiene todos los vehículos
getVehicleById(id: string)               // Obtiene un vehículo
createVehicle(vehicle, adminId)          // Crea vehículo (admin)
updateVehicle(id, updates)               // Actualiza vehículo (admin)
deleteVehicle(id)                        // Elimina vehículo (admin)

// Signals (reactivas)
allVehicles: Signal<Vehicle[]>           // Todos los vehículos
featuredVehicles: Signal<Vehicle[]>      // Vehículos destacados
isLoading: Signal<boolean>               // Estado de carga
error: Signal<string | null>             // Mensajes de error
```

## Flujo de Autenticación

### Web Pública (Sin Login)
1. Usuario accede a `/` → Home (público)
2. Usuario ve `/vehiculos` → Listado (público)
3. Usuario ve `/vehiculos/:id` → Detalle (público)
4. Usuario ve `/quienes-somos` → Info (público)

### Área Admin (Protegida)
1. Admin accede a `/login` → Formulario
2. Ingresa email y password
3. AuthService valida con Supabase
4. Si OK → Redirige a `/admin`
5. AdminGuard valida sesión
6. Admin puede: Crear, Editar, Eliminar vehículos
7. Admin hace logout → Sesión se limpia, redirige a home

## Componentes Principales

### LoginComponent
- Formulario reactivo (email/password)
- Validaciones
- Mensajes de error
- Redirección a admin

### AdminComponent
- Panel admin con 3 modos:
  - **List**: Tabla de vehículos con botones Editar/Eliminar
  - **Create**: Formulario para crear vehículo
  - **Edit**: Formulario para editar vehículo
- Botón de logout
- Manejo de errores y mensajes de éxito

### VehiculosComponent
- Listado de todos los vehículos
- No requiere autenticación
- Datos desde VehicleService (Supabase o fallback local)

## Flujo de Datos

```
UI Component
    ↓
Service (AuthService / VehicleService)
    ↓
Supabase API
    ↓
PostgreSQL DB (tablas: vehicles, admin_logs)
```

## Variables de Entorno

Ubicadas en `src/environments/`:

```typescript
// environment.ts (producción)
export const environment = {
  production: true,
  supabaseUrl: 'https://...',
  supabaseKey: 'eyJ...'
};

// environment.development.ts (desarrollo)
export const environment = {
  production: false,
  supabaseUrl: 'https://...',
  supabaseKey: 'eyJ...'
};
```

## Instalación y Ejecución

### 1. Instalar dependencias
```bash
cd frontend
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm start
# http://localhost:4200
```

### 3. Build para producción
```bash
npm run build
```

## Testing

### 1. Web pública accesible
```
✓ http://localhost:4200/ - OK
✓ http://localhost:4200/vehiculos - OK
✓ http://localhost:4200/vehiculos/1 - OK
✓ http://localhost:4200/quienes-somos - OK
```

### 2. Login requerido para admin
```
1. Ir a http://localhost:4200/admin
2. Debe redirigir a http://localhost:4200/login
3. Ingresar credenciales incorrectas → Mostrar error
4. Ingresar credenciales correctas → Ir a /admin
```

### 3. CRUD de vehículos
```
1. En panel admin, clic "+ Nuevo Vehículo"
2. Completar formulario
3. Clic "Crear Vehículo"
4. ✓ Debe aparecer en tabla
5. Editar: clic "Editar" → Modificar → "Actualizar"
6. Eliminar: clic "Eliminar" → Confirmar
7. Los cambios deben aparecer en /vehiculos
```

### 4. Logout
```
1. En panel admin, clic "Cerrar Sesión"
2. ✓ Debe ir a home
3. ✓ Sesión debe estar limpia
4. Si intenta ir a /admin → Redirige a /login
```

## Características

✅ Autenticación admin con Supabase  
✅ Web pública 100% accesible sin login  
✅ CRUD completo de vehículos desde admin  
✅ Datos en tiempo real (Supabase)  
✅ Fallback a datos locales si Supabase falla  
✅ Responsive design  
✅ Manejo robusto de errores  
✅ Loading states  

## Dependencias Clave

- **Angular 21**: Framework principal
- **@supabase/supabase-js**: Cliente de Supabase
- **RxJS**: Reactividad
- **TypeScript**: Lenguaje

## Próximos Pasos (Opcional)

- [ ] Agregar paginación a tabla de vehículos
- [ ] Búsqueda y filtrado en admin
- [ ] Subida de imágenes a Supabase Storage
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Historial de cambios (admin_logs)
- [ ] Autenticación con OAuth (Google, GitHub)
- [ ] Dark mode
