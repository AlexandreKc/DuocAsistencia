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
  // Almacenar el nombre y el pass del user
  username: string = "";
  password: string = "";
  alertButtons = ['Action'];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private database: DatabaseService // Inyecta el servicio de base de datos
  ) {}

  ngOnInit() {}

  // Método para mostrar la alerta
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Método para iniciar sesión
  login() {
    if (this.username.length >= 5 && this.username.length <= 15 && this.password.length >= 6 && this.password.length <= 15) {
      // Validar las credenciales a través del servicio de base de datos
      this.database.validateUser(this.username, this.password).subscribe(
        async (response: any) => {
          if (response.valid) {
            // Redirigir a la página home si es válido
            this.router.navigate(['/home'], { queryParams: { username: this.username } });
          } else {
            // Mostrar alerta de error de credenciales
            this.mostrarAlerta('Error', 'Usuario o contraseña incorrectos');
          }
        },
        async (error) => {
          // Mostrar alerta de error en el servidor
          this.mostrarAlerta('Error', 'Hubo un problema con el servidor');
        }
      );
    } else {
      // Mostrar alerta si los campos no son válidos
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos correctamente.');
    }
  }
}
