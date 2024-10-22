import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../database/database.service'; // Importa el servicio de base de datos

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correo: string = "";
  password: string = "";
  passwordType: string = 'password'; // Para manejar la visibilidad de la contraseña
  username: string = "";

  constructor(
    private router: Router,
    private alertController: AlertController,
    private database: DatabaseService // Inyecta el servicio de base de datos
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
    console.log('Correo:', this.correo); // Para verificar el valor de correo
    console.log('Contraseña:', this.password); // Para verificar el valor de password

    if (this.correo && this.password) {
      this.database.validateUser(this.correo, this.password).subscribe(
        async (response: any) => {
          if (response.valid) {
            // Almacena el nombre del usuario para usarlo en home
            const nombreUsuario = response.nombre; 
            const id_user = response.id_tp_usuario; 
            this.router.navigate(['/home'], { queryParams: { username: nombreUsuario, id_Tp_Usuario: id_user } });
            this.mostrarAlerta('Ingreso con éxito', 'Has iniciado sesión correctamente.');
          } else {
            this.mostrarAlerta('Error', 'Correo o contraseña incorrectos');
          }
        },
        async (error) => {
          console.error('Error en el servidor:', error);
          this.mostrarAlerta('Error', 'Error al iniciar sesión, servidor desconectado');
        }
      );
    } else {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos correctamente.');
    }
  }
}
