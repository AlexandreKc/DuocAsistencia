import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Método para realizar la autenticación
  authenticate(correo: string, password: string): boolean{
    return correo === 'correo' && password === 'contraseña';
  }

  constructor() { }
}
