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
    // Verificar si el usuario ya está logueado al inicio
    if (this.userService.isUserLoggedIn()) {
      // Si ya está logueado, redirigir al home
      this.router.navigate(['/home']);
    }

    // Solicitar permisos para notificaciones locales
    this.requestPermission();
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

  // Método para manejar el login
  login() {
    if (this.correo && this.password) {
      this.database.validateUser(this.correo, this.password).subscribe(
        async (response: any) => {
          if (response.valid) {
            // Si el login es válido, guardar los datos del usuario
            const userData = {
              nombre: response.nombre,
              id_tp_usuario: response.id_tp_usuario,
              correo: this.correo,
              contrasena: this.password,
              id: response.id  // Asegúrate de que el id esté en la respuesta
            };
            this.userService.setUserData(userData);  // Guardamos los datos en el UserService

            // Redirigir automáticamente al home
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

  // Solicitar permisos para notificaciones locales
  async requestPermission() {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
    } else {
      console.error('Permiso para notificaciones locales denegado.');
    }
  }
}
