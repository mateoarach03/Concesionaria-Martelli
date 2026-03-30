-- ========================================
-- SETUP SUPABASE PARA CONCESIONARIA MARTELLI
-- ========================================
-- Ejecuta estos queries en la consola SQL de Supabase
-- https://supabase.com/dashboard

-- 1. CREAR TABLA VEHICLES
-- Guarda el inventario de vehículos
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  year INTEGER NOT NULL, -- Renombrado de 'año' para evitar problemas de encoding
  precio DECIMAL(12, 2) NOT NULL,
  descripcion TEXT,
  images TEXT[], -- Arreglo de URLs para múltiples imágenes (opción simple)
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. CREAR TABLA ADMIN_LOGS (OPCIONAL - para auditoría)
-- Registra cambios realizados por el admin
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. CONFIGURAR RLS (Row Level Security) EN TABLA VEHICLES
-- Solo usuarios autenticados (admin) pueden ver/editar vehículos
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden VER vehículos (para mostrar en web pública)
CREATE POLICY "allow_read_vehicles" ON public.vehicles
  FOR SELECT USING (true);

-- Política: Solo el admin autenticado puede CREAR vehículos
CREATE POLICY "allow_admin_create_vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

-- Política: Solo el admin autenticado puede ACTUALIZAR sus vehículos
CREATE POLICY "allow_admin_update_vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = created_by)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = created_by);

-- Política: Solo el admin autenticado puede ELIMINAR sus vehículos
CREATE POLICY "allow_admin_delete_vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() = created_by);

-- 4. CONFIGURAR RLS EN TABLA ADMIN_LOGS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Política: Solo el admin puede ver sus propios logs
CREATE POLICY "allow_admin_read_own_logs" ON public.admin_logs
  FOR SELECT USING (auth.uid() = admin_id);

-- ========================================
-- PASOS MANUALES EN SUPABASE DASHBOARD:
-- ========================================
-- 1. Ve a: https://supabase.com/dashboard -> Tu proyecto
-- 2. Ve a: SQL Editor
-- 3. Copia y pega los queries anteriores (3 CREATE TABLE + 5 CREATE POLICY)
-- 4. Ejecuta cada query
-- 5. Ve a Authentication > Users
-- 6. Crea un usuario admin con email y password
--    - Email: admin@martelli.com (o tu preferencia)
--    - Password: (elige una contraseña segura)
-- 7. ¡Listo! El sistema está configurado.

-- ========================================
-- DATOS DE EJEMPLO REALES
-- ========================================
-- IMPORTANTE: Para que el INSERT funcione, debes obtener el UUID de tu usuario admin:
-- Ve a Authentication > Users y copia el valor de "User ID".
-- Luego reemplaza 'TU_UUID_AQUI' en las siguientes líneas por ese valor.

-- INSERT INTO public.vehicles (marca, modelo, year, precio, descripcion, images, stock, created_by)
-- VALUES
--   (
--     'Toyota', 
--     'Corolla Cross XEi', 
--     2022, 
--     28500000.00, 
--     'Excelente estado, service oficial al día. Motor 2.0 con 170 CV, caja automática CVT. Tapizado de cuero, pantalla táctil, climatizador bi-zona.', 
--     ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb', 'https://images.unsplash.com/photo-1590362891991-f776e747a588'], 
--     1, 
--     'TU_UUID_AQUI'
--   ),
--   (
--     'Volkswagen', 
--     'Tiguan Allspace', 
--     2021, 
35800000.00, 
--     'Primera mano. Tercera fila de asientos, techo panorámico corredizo, tablero digital Active Info Display, sensores de estacionamiento.', 
--     ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8'], 
--     1, 
--     'TU_UUID_AQUI'
--   ),
--   (
--     'Ford', 
--     'Ranger XLT 4x4', 
--     2023, 
42000000.00, 
--     'Versión XLT 4x4, muy equipada. Levanta vidrios en las 4 puertas, espejos eléctricos, llantas de aleación, computadora de abordo.', 
--     ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'], 
--     1, 
--     'TU_UUID_AQUI'
--   );
