import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // Cambia la URL base de la API a la de tu backend local
  private apiUrl = 'http://localhost:3000'; // URL base de la API en localhost (cambia el puerto si es necesario)
  
  constructor(private http: HttpClient) {}
  
  // Método para validar el usuario
  validateUser(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { correo, password });
  }

  // Registrar Usuario
  registrarUsuario(nuevoUsuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, nuevoUsuario);
  }

  // Verificar si el correo existe
  verificarCorreo(correo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validar-correo`, { correo });
  }

  // Cambiar la contraseña
  cambiarContrasena(correo: string, nuevaContrasena: string): Observable<any> {
    const body = { correo, nuevaContrasena };
    return this.http.post(`${this.apiUrl}/cambiar-contrasena`, body);
  }
}
