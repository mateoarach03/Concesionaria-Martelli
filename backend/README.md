# Backend - Concesionaria Martelli

## Estructura

```
backend/
├── SUPABASE_SETUP.sql    # Script de configuración de Supabase
└── README.md             # Este archivo
```

## Configuración de Supabase

### Paso 1: Ejecutar los queries SQL
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: **lfgusprcqupaflrxkfrs**
3. Ve a **SQL Editor**
4. Abre el archivo `SUPABASE_SETUP.sql` de esta carpeta
5. Copia y pega TODO el contenido
6. Ejecuta los queries

**Esto creará:**
- ✅ Tabla `vehicles` (inventario de vehículos)
- ✅ Tabla `admin_logs` (auditoría)
- ✅ Políticas RLS (seguridad)

### Paso 2: Crear usuario admin
1. Ve a **Authentication > Users** en Supabase Dashboard
2. Clic en **"Invite"** o **"Create new user"**
3. Ingresa:
   - **Email**: admin@martelli.com (o tu preferencia)
   - **Password**: (elige una contraseña fuerte)
4. Copia el **User ID** (UUID) que aparece

### Paso 3: Agregar datos de ejemplo (opcional)
En el SQL Editor, ejecuta:
```sql
INSERT INTO public.vehicles (marca, modelo, año, precio, descripcion, stock, created_by)
VALUES
  ('Toyota', 'Corolla 2024', 2024, 25000.00, 'Sedán compacto, bien equipado', 5, 'YOUR_ADMIN_UUID_HERE'),
  ('Honda', 'Civic Turbo', 2023, 28000.00, 'Deportivo, excelentes prestaciones', 3, 'YOUR_ADMIN_UUID_HERE'),
  ('Ford', 'Focus ST', 2024, 26000.00, 'Hatchback deportivo', 2, 'YOUR_ADMIN_UUID_HERE');
```

Reemplaza `'YOUR_ADMIN_UUID_HERE'` con el UUID del admin que copiaste en el Paso 2.

## Estructura de la BD

### Tabla: `vehicles`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único (generado automáticamente) |
| marca | TEXT | Marca del vehículo (Toyota, Honda, etc.) |
| modelo | TEXT | Modelo y año (Corolla 2024, Civic, etc.) |
| año | INTEGER | Año de fabricación |
| precio | DECIMAL | Precio en pesos/dólares |
| descripcion | TEXT | Descripción detallada |
| imagen_url | TEXT | URL de la imagen del vehículo |
| stock | INTEGER | Cantidad disponible |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha última actualización |
| created_by | UUID | ID del admin que creó |

### Tabla: `admin_logs`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| admin_id | UUID | ID del admin |
| action | TEXT | CREATE, UPDATE, DELETE |
| entity_type | TEXT | vehicle, user, etc. |
| entity_id | UUID | ID de la entidad modificada |
| changes | JSONB | Cambios realizados |
| created_at | TIMESTAMP | Fecha del cambio |

## Políticas RLS (Seguridad)

### Vehicles
- ✅ **SELECT (Lectura)**: Público (web pública puede ver)
- 🔒 **INSERT**: Solo admin autenticado
- 🔒 **UPDATE**: Solo admin autenticado
- 🔒 **DELETE**: Solo admin autenticado

### Admin Logs
- 🔒 **SELECT**: Solo el admin que realizó la acción

## Credenciales Supabase

```
URL: https://lfgusprcqupaflrxkfrs.supabase.co
Anon Key: [Guardado en environment.ts]
```

**Importante**: Estas credenciales están públicamente disponibles (es normal para Supabase). Las políticas RLS protegen los datos.

## Testing

### 1. Verificar que la web pública puede ver vehículos
```bash
npm start
# Ve a http://localhost:4200/vehiculos
```

### 2. Verificar login admin
- Ve a http://localhost:4200/login
- Ingresa: admin@martelli.com + contraseña
- Debe redirigir a /admin

### 3. Verificar CRUD en admin
- Crear vehículo
- Editar vehículo
- Eliminar vehículo
- Verificar que aparecen en la web pública

### 4. Verificar logout
- Clic en botón "Logout"
- Debe redirigir a home

## Próximos Pasos

1. ✅ Configurar Supabase
2. ✅ Crear usuario admin
3. ➡️ Actualizar AuthService
4. ➡️ Crear VehicleService
5. ➡️ Crear AdminComponent
6. ➡️ Testing completo
