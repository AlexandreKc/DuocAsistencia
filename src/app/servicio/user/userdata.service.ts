import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  private userData: any = null;
  private userLoggedIn = new BehaviorSubject<boolean>(false); 
  private userId: number | null = null;

  constructor() {
    this.loadUserData(); // Cargar datos cuando se crea el servicio
  }

  // Método para guardar los datos del usuario
  setUserData(data: any) {
    this.userData = data;
    this.userId = data.id; 
    this.userLoggedIn.next(true);

    // Guardamos los datos en localStorage
    localStorage.setItem('userData', JSON.stringify(data)); 
  }

  // Método para obtener el ID del usuario
  getUserId() {
    return this.userId; 
  }

  // Método para obtener los datos del usuario
  getUserData() {
    return this.userData;
  }

  // Método para limpiar los datos del usuario (cuando cierre sesión)
  clearUserData() {
    this.userData = null;
    this.userId = null; 
    this.userLoggedIn.next(false);
  
    // Limpiar localStorage
    localStorage.removeItem('userData'); 
  }

  // Método para verificar si el usuario está logueado
  isUserLoggedIn() {
    return this.userLoggedIn.asObservable();
  }

  // Método para cargar los datos del usuario si están en el localStorage
  loadUserData() {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.userData = JSON.parse(storedData);
      this.userId = this.userData.id; // Asegurarse de que el ID también se extrae de los datos
      this.userLoggedIn.next(true);
    }
  }
}
