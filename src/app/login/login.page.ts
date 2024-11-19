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
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.password);
  
    if (this.correo && this.password) {
      // Llama al método de validación de usuario del servicio DatabaseService
      this.database.validateUser(this.correo, this.password).subscribe(
        async (response: any) => {
          if (response.valid) {
            // Si el login es válido, guardar los datos en UserService
            const userData = {
              nombre: response.nombre,
              id_tp_usuario: response.id_tp_usuario,
              correo: this.correo,
              contrasena: this.password
            };
  
            this.userService.setUserData(userData);
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
}
