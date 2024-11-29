import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences'; // Para manejar almacenamiento local

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  constructor() {
    this.checkFirstLaunch();
  }

  // Solicita permisos para usar notificaciones locales
  async requestPermission() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Permiso para notificaciones locales concedido.');
    } else {
      console.error('Permiso para notificaciones locales denegado.');
    }
  }

  // Comprueba si es la primera vez que se abre la app
  async checkFirstLaunch() {
    const { value } = await Preferences.get({ key: 'isFirstLaunch' });

    if (!value) {
      // Si no existe el valor, significa que es la primera ejecución
      console.log('Primera vez que se ejecuta la aplicación.');
      await this.requestPermission();
      this.scheduleFirstLaunchNotification();

      // Guarda el estado para que no vuelva a lanzarse
      await Preferences.set({ key: 'isFirstLaunch', value: 'true' });
    } else {
      console.log('La aplicación ya se había ejecutado anteriormente.');
    }
  }

  // Programa una notificación local
  async scheduleFirstLaunchNotification() {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: '¡Bienvenido a AsistApp!',
            body: 'Gracias por instalar nuestra aplicación. ¡Explora todas las funciones!',
            schedule: { at: new Date(new Date().getTime() + 15000) },
            smallIcon: 'ic_launcher',
            extra: { data: 'Primera ejecución' },
          }
        ]
      });
      console.log('Notificación de bienvenida programada.');
    } catch (error) {
      console.error('Error al programar la notificación:', error);
    }
  }
}
