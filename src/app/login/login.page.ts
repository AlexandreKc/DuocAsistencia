import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../database/database.service'; // Importa el servicio de base de datos
import { UserService } from '../user/datos.service'; // Importa el servicio de usuario

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

  ngOnInit() {}

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

  // Inicio de sesión
  login() {
    console.log('Correo:', this.correo);   // Para verificar el valor del correo en la consola
    console.log('Contraseña:', this.password); // Para verificar el valor de la contraseña en la consola

    if (this.correo && this.password) {
      // Llama al método de validación de usuario del servicio DatabaseService
      this.database.validateUser(this.correo, this.password).subscribe(
        async (response: any) => {
          if (response.valid) {
            // Si el inicio de sesión es válido, guarda los datos en el UserService
            const userData = {
              nombre: response.nombre, // Nombre de usuario recibido en la respuesta
              id_tp_usuario: response.id_tp_usuario, // Tipo de usuario
              correo: this.correo,
              contrasena: this.password
            };

            // Guardar los datos del usuario en el servicio
            this.userService.setUserData(userData);

            // Navega a la página de inicio (home)
            this.router.navigate(['/home'], { queryParams: { username: userData.nombre, id_Tp_Usuario: userData.id_tp_usuario } });
            
            // Muestra una alerta de éxito
            this.mostrarAlerta('Ingreso con éxito', 'Has iniciado sesión correctamente.');
          } else {
            // Si las credenciales son incorrectas, muestra una alerta de error
            this.mostrarAlerta('Error', 'Correo o contraseña incorrectos');
          }
        },
        async (error) => {
          // Si ocurre un error de servidor, muestra una alerta de error
          console.error('Error en el servidor:', error);
          this.mostrarAlerta('Error', 'Error al iniciar sesión, servidor desconectado');
        }
      );
    } else {
      // Si los campos no están completos, muestra una alerta de error
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos correctamente.');
    }
  }
}
