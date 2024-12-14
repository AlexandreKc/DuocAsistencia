import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IonicSharedModule } from 'src/app/shared.module';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // Cambia esta URL para apuntar a tu servidor de Railway
  private apiUrl = 'https://backendassistapp-production.up.railway.app'; // URL de la API en Railway
  
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
  // Método para obtener las materias de un usuario
  getMaterias(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/materias/usuario/${usuarioId}`);
  }
  // Método para displayear todas las materias a profesor.
  getAllMaterias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materias`);
  }
  // Cambiar el nombre de la propiedad a "idMateria"
  crearClase(idMateria: string): Observable<any> {
    const url = `${this.apiUrl}/crear-clase`;
    return this.http.post(url, { idMateria: idMateria }); 
  }
  // Método para obtener las clases de una materia
  verClases(idMateria: string): Observable<any> {
    const url = `${this.apiUrl}/clases/materia/${idMateria}`;
    return this.http.get(url); 
  }
  //Obtener alumnos de materia
  getAlumnosDeMateria(idMateria: string) {
    return this.http.get<any>(`${this.apiUrl}/materias/${idMateria}/alumnos`);
  }
  // Método para obtener los alumnos de una clase
  getAlumnosPorClase(idClase: number): Observable<any> {
    const url = `${this.apiUrl}/clases/${idClase}/alumnos`;
    return this.http.get(url);
  }
  //metodo para updatear la asistencia
  updateAsistencia(idClase: string, idUsuario: string): Observable<any> {
    const url = `${this.apiUrl}/update-asistencia`;
    const headers = { 'Content-Type': 'application/json' }; // Encabezados explícitos
    return this.http.post(url, { id_clase: idClase, id_usuario: idUsuario }, { headers });
  }
}
