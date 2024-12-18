import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonicSharedModule } from 'src/app/shared.module';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicSharedModule]
})
export class RecuperacionPage {
  correo: string = '';

  constructor(
    private router: Router,
    private databaseService: DatabaseService, // Servicio de base de datos para verificar el correo
    private alertController: AlertController,
  ) {}

  onSubmit() {
    // Llama al servicio para verificar si el correo existe en la base de datos
    this.databaseService.verificarCorreo(this.correo).subscribe(
      async (response) => {
        if (response.existe) {
          // Si el correo existe, redirige a la página de cambiar-contrasena
          this.router.navigate(['/cambiar-contrasena'], {
            queryParams: { correo: this.correo },
          });
        } else {
          // Si el correo no existe, muestra un toast de error
          await Toast.show({
            text: 'El correo no está registrado',
            duration: 'short',
            position: 'bottom',
          });
        }
      },
      async (error) => {
        // Manejo de errores del servidor
        await Toast.show({
          text: 'Error al verificar el correo',
          duration: 'short',
          position: 'bottom',
        });
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
