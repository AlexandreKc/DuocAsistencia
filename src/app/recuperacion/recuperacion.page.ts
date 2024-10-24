import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; // Import para mostrar alertas
import { DatabaseService } from '../database/database.service'; // Import del servicio de base de datos

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage {
  correo: string = '';

  constructor(
    private router: Router,
    private databaseService: DatabaseService, // Servicio de base de datos para verificar el correo
    private alertController: AlertController
  ) {}

  onSubmit() {
    // Llama al servicio para verificar si el correo existe en la base de datos
    this.databaseService.verificarCorreo(this.correo).subscribe(
      async (response) => {
        if (response.existe) {
          // Si el correo existe, redirige a la página de cambiar-contrasena
          this.router.navigate(['/cambiar-contrasena'], {
            queryParams: { correo: this.correo }
          });
        } else {
          // Si el correo no existe, muestra una alerta de error
          await this.mostrarError('El correo no está registrado');
        }
      },
      async (error) => {
        // Manejo de errores del servidor
        await this.mostrarError('Error al verificar el correo');
      }
    );
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
