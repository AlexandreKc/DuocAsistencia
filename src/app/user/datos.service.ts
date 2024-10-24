import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root' // Esto asegura que el servicio sea un singleton y esté disponible en toda la aplicación
})
export class UserService {
  private userData: any = null;
  private userLoggedIn = new BehaviorSubject<boolean>(false); // Para manejar el estado de inicio de sesión
  constructor() {}
  
  // Método para guardar los datos del usuario
  setUserData(data: any) {
    this.userData = data;
    this.userLoggedIn.next(true);
  }
  
  // Método para obtener los datos del usuario
  getUserData() {
    // Mostrar los datos del usuario en la consola
    console.log('Datos del usuario:', this.userData);
    
    return this.userData;
  }
  // Método para limpiar los datos del usuario (cuando cierre sesión, por ejemplo)
  clearUserData() {
    this.userData = null;
    this.userLoggedIn.next(false); // Emitir que el usuario ha cerrado sesión
  }
  //Para ver si esta logueado
  isUserLoggedIn() {
    return this.userLoggedIn.asObservable();
  }
}
