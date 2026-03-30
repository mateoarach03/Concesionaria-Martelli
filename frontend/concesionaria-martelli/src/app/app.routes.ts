import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { VehiculosComponent } from './components/vehiculos/vehiculos';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos';
import { VehiculoDetalleComponent } from './components/vehiculo-detalle/vehiculo-detalle';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio - Martelli Automotores' },
  { path: 'vehiculos', component: VehiculosComponent, title: 'Vehículos - Martelli Automotores' },
  { path: 'vehiculos/:id', component: VehiculoDetalleComponent, title: 'Detalle del Vehículo - Martelli Automotores' },
  { path: 'quienes-somos', component: QuienesSomosComponent, title: 'Quiénes Somos - Martelli Automotores' },
  { path: 'login', component: LoginComponent, title: 'Acceso - Martelli Automotores' },
  { path: 'admin', component: AdminComponent, title: 'Admin - Martelli Automotores', canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];
