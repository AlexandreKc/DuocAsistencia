import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'recuperacion',
    loadChildren: () => import('./recuperacion/recuperacion.module').then(m => m.RecuperacionPageModule)
  },
  {
    path: 'cambiar-contrasena',
    loadChildren: () => import('./cambiar-contrasena/cambiar-contrasena.module').then(m => m.CambiarContrasenaPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'secciones',
    loadChildren: () => import('./secciones/secciones.module').then(m => m.SeccionesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qr',
    loadChildren: () => import('./qr/qr.module').then(m => m.QrPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qr-reader',
    loadChildren: () => import('./qr-reader/qr-reader.module').then(m => m.QrReaderPageModule),
    canActivate: [AuthGuard]  // Aquí se agrega el AuthGuard
  },
  {
    path: 'asistencias',
    loadChildren: () => import('./materias/asistencias/asistencias.module').then( m => m.AsistenciasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'gestion',
    loadChildren: () => import('./materias/gestion/gestion.module').then( m => m.GestionPageModule),
    canActivate: [AuthGuard]
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
