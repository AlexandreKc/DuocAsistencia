import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../user/datos.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    
    return this.userService.isUserLoggedIn().pipe(
      map(loggedIn => {
        if (loggedIn) {
          return true; // Permitir el acceso si está logueado
        } else {
          // Si no está logueado, redirigir a la página de inicio de sesión
          this.router.navigate(['/login']);
          return false; // Bloquear el acceso
        }
      })
    );
  }
}
