import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crea un mock para el servicio Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('Debería crear el guard', () => {
    expect(guard).toBeTruthy();
  });

  it('Debería permitir el acceso cuando está autenticado', (done) => {
    spyOn(guard, 'canActivate').and.returnValue(of(true));
    
    guard.canActivate(null as any, null as any).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('Debería bloquear el acceso y redirigir cuando no está autenticado', (done) => {
    spyOn(guard, 'canActivate').and.callFake(() => {
      routerSpy.navigate(['/login']);
      return of(false);
    });

    guard.canActivate(null as any, null as any).subscribe((result) => {
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
