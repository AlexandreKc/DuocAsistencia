import { Routes } from '@angular/router';
import { CanActivate } from '@angular/router';
import { UserdataService } from './servicio/user/userdata.service';
import { AuthGuard } from './servicio/guard/authguard.service';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./inicio/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./inicio/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'recuperacion',
    loadComponent: () => import('./inicio/recuperacion/recuperacion.page').then(m => m.RecuperacionPage)
  },
  {
    path: 'cambiar-contrasena',
    loadComponent: () => import('./inicio/cambiar-contrasena/cambiar-contrasena.page').then(m => m.CambiarContrasenaPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./medio/home/home.page').then(m => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'gestion',
    loadComponent: () => import('./medio/gestion/gestion.page').then(m => m.GestionPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle',
    loadComponent: () => import('./medio/detalle/detalle.page').then(m => m.DetallePage)
  },
  {
    path: 'escanear',
    loadComponent: () => import('./medio/escanear/escanear.page').then( m => m.EscanearPage)
  },
  {
    path: '**',
    redirectTo: '/login',
  },

];
