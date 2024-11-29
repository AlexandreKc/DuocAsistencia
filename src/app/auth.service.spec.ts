import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  // PRUEBAS UNITARIAS

  // 1. Estoy validando que el servicio se cree correctamente
  it('Debería crear el servicio correctamente', () => {
    expect(service).toBeTruthy();
  });
  // 2. Estoy validando las credenciales
  it('Debería retornar un true para las credenciales válidas', ()=> {
    expect(service.authenticate('correo', 'contraseña')).toBeTrue();
  })
  // 3. Estoy validando credenciales falsas
  it('Debería retornar un false para credenciales inválidas', ()=> {
    expect(service.authenticate('wrongUser', 'wrongPass')).toBeFalse();
  })

});
