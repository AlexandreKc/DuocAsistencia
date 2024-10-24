import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  //Validar Usuario
  validateUser(correo: string, password: string): Observable<any> {
    const body = { correo, password }; 
    return this.http.post(`${this.apiUrl}/login`, body);
  }
  //Registrar Usuario

  registrarUsuario(nuevoUsuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, nuevoUsuario);
  }
  

}
