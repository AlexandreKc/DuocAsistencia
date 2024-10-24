import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Esto asegura que el servicio sea un singleton y esté disponible en toda la aplicación
})
export class UserService {
  private userData: any = null;

  constructor() {}

  // Método para guardar los datos del usuario
  setUserData(data: any) {
    this.userData = data;
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
  }
}
