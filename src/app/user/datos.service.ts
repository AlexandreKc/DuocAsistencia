import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Asegura que el servicio sea único y esté disponible en toda la aplicación
})
export class UserService {
  private userData: any = null;
  private userLoggedIn = new BehaviorSubject<boolean>(false);  // Estado de inicio de sesión
  private userId: number | null = null;  // Variable para almacenar el ID de usuario

  constructor() {}

  // Método para guardar los datos del usuario
  setUserData(data: any) {
    this.userData = data;
    this.userId = data.id;  // Guardamos el ID de usuario cuando se loguea
    this.userLoggedIn.next(true);  // Emite el estado de que el usuario está logueado
  }

  // Método para obtener el ID del usuario
  getUserId() {
    return this.userId;  // Retorna el ID almacenado
  }

  // Método para obtener los datos del usuario
  getUserData() {
    return this.userData;
  }

  // Método para limpiar los datos del usuario (cuando cierre sesión)
  clearUserData() {
    this.userData = null;
    this.userId = null;  // Limpiamos el ID cuando el usuario cierra sesión
    this.userLoggedIn.next(false);
  }

  // Método para verificar si el usuario está logueado
  isUserLoggedIn() {
    return this.userLoggedIn.asObservable();
  }
}
