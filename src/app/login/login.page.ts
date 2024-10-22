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
  username: string ="";

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
  //inicio de sesión
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
          } else {
            this.mostrarAlerta('Error', 'Correo o contraseña incorrectos');
          }
        },
        async (error) => {
          console.error('Error en el servidor:', error);
          this.mostrarAlerta('Error', 'Hubo un problema con el servidor');
        }
      );
    } else {
      this.mostrarAlerta('Error', 'Por favor, completa todos los campos correctamente.');
    }
  }
}
