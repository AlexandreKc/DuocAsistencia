import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './authguard.service';  // Asegúrate de que el nombre del archivo y clase coincidan
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crea un mock para el servicio Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],  // Incluye los módulos necesarios para pruebas
      providers: [
        AuthGuard,  // Proveer el AuthGuard
        { provide: Router, useValue: routerSpy },  // Usar el mock para Router
      ],
    });

    guard = TestBed.inject(AuthGuard);  // Inyectar el AuthGuard en el test
  });

  it('Debería crear el guard', () => {
    expect(guard).toBeTruthy();  // Verifica que el guard se haya creado correctamente
  });

  it('Debería permitir el acceso cuando está autenticado', (done) => {
    // Simula que el guard permite el acceso cuando está autenticado
    spyOn(guard, 'canActivate').and.returnValue(of(true));

    guard.canActivate(null as any, null as any).subscribe((result) => {
      expect(result).toBeTrue();  // Espera que el acceso sea permitido
      done();  // Finaliza el test
    });
  });

  it('Debería bloquear el acceso y redirigir cuando no está autenticado', (done) => {
    // Simula que el guard bloquea el acceso y redirige a /login cuando no está autenticado
    spyOn(guard, 'canActivate').and.callFake(() => {
      routerSpy.navigate(['/login']);  // Simula la redirección a /login
      return of(false);  // Simula que el acceso es bloqueado
    });

    guard.canActivate(null as any, null as any).subscribe((result) => {
      expect(result).toBeFalse();  // Espera que el acceso sea bloqueado
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);  // Verifica que se haya llamado a navigate con el valor correcto
      done();  // Finaliza el test
    });
  });
});
