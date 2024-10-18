import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Método para verificar las credenciales
  validateUser(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }
}
