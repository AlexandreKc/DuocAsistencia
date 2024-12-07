import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../database/database.service'; // Importa el servicio de base de datos
import { UserService } from '../user/datos.service'; // Importa el servicio de usuario
import { LocalNotifications } from '@capacitor/local-notifications';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo: string = "";      // Campo para el correo
  password: string = "";    // Campo para la contraseña
  passwordType: string = 'password'; // Para manejar la visibilidad de la contraseña

  constructor(
    private router: Router,
    private alertController: AlertController,
    private database: DatabaseService, // Inyecta el servicio de base de datos
    private userService: UserService    // Inyecta el servicio de usuario
  ) {}

  ngOnInit() {
    this.requestPermission();
    this.scheduleNotification(); // Llamar a scheduleNotification al inicio
  }

  // Método para mostrar alertas
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  login() {
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.password);
  
    if (this.correo && this.password) {
      // Llamamos al método de validación de usuario del servicio DatabaseService
      this.database.validateUser(this.correo, this.password).subscribe(
        async (response: any) => {
          if (response.valid) {
            // Verificar qué contiene la respuesta
            console.log('Respuesta del backend:', response);
  
            // Si el login es válido, guardar los datos en UserService
            const userData = {
              nombre: response.nombre,
              id_tp_usuario: response.id_tp_usuario,
              correo: this.correo,
              contrasena: this.password,
              id: response.id  // Asegúrate de que el id esté en la respuesta
            };
  
            console.log('Datos del usuario a almacenar:', userData);
  
            this.userService.setUserData(userData);  // Guardamos los datos en el UserService
  
            // Redirigir a la página de home
            this.router.navigate(['/home'], { queryParams: { username: userData.nombre, id_Tp_Usuario: userData.id_tp_usuario } });
  
            // Alerta de éxito
            this.mostrarAlerta('Ingreso con éxito', 'Has iniciado sesión correctamente.');
          } else {
            // Si las credenciales son incorrectas
            this.mostrarAlerta('Error', 'Correo o contraseña incorrectos');
          }
        },
        async (error) => {
          // Si ocurre un error, muestra alerta de servidor desconectado
          console.error('Error en el servidor:', error);
          this.mostrarAlerta('Error', 'Error al iniciar sesión, servidor desconectado');
        }
      );
    } else {
      // Si no se completan los campos
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos correctamente.');
    }
  }
  
    // Solicita permisos para usar notificaciones locales
    async requestPermission() {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display === 'granted') {
      } else {
        console.error('Permiso para notificaciones locales denegado.');
      }
    }
    // Programar la notificación local
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
  }
}
