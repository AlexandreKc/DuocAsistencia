import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences'; // Para manejar almacenamiento local

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  constructor() { }

  // Solicita permisos para usar notificaciones locales
  async requestPermission() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      console.log('Permiso para notificaciones locales concedido.');
      this.scheduleNotification(); // Llama a la función para mostrar la notificación
    } else {
      console.error('Permiso para notificaciones locales denegado.');
    }
  }

  // Programar una notificación local
  async scheduleNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Bienvenido a AsistApp',
          body: '¡Hola! Prueba las nuevas funciones de AsistApp',
          id: 1,
          schedule: {
            at: new Date(new Date().getTime() + 10000) // Programar 10 segundos después
          },
          actionTypeId: '',
          extra: null
        }
      ]
    });

    console.log('Notificación programada.');
  }
}
