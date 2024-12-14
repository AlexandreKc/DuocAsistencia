import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { AlertController } from '@ionic/angular';
import { IonicSharedModule } from 'src/app/shared.module';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicSharedModule]
})
export class CambiarContrasenaPage  {

  newpassword: string = '';
  confirmpassword: string = '';
  correo: string = ''; // Asegúrate de recibir el correo desde los queryParams

  constructor(
    private router: Router,
    private databaseService: DatabaseService, // Inyecta el servicio de base de datos
    private alertController: AlertController // Para mostrar alertas
  ) { 
    // Obtén el correo de los query params
    this.router.routerState.root.queryParams.subscribe(params => {
      this.correo = params['correo']; 
    });
  }

  async onSubmit(form: NgForm) {
    if (form.valid && this.newpassword === this.confirmpassword) {
      // Llama al servicio para cambiar la contraseña
      this.databaseService.cambiarContrasena(this.correo, this.newpassword).subscribe(
        async (response) => {
          // Manejo de respuesta exitosa
          await this.mostrarAlert('Contraseña cambiada exitosamente.');
          form.reset(); // Limpia el formulario
          this.router.navigate(['/login']); // Redirige al login
        },
        async (error) => {
          // Manejo de errores del servidor
          const errorMessage = error.error?.message || 'Error al cambiar la contraseña. Intente nuevamente.';
          await this.mostrarAlert(errorMessage);
        }
      );
    } else {
      // aparecerá si las contraseñas no coinciden o si el formulario no es válido.
      const errorMessage = form.invalid ? 'Formulario inválido.' : 'Las contraseñas no coinciden.';
      await this.mostrarAlert(errorMessage);
      console.log(errorMessage);
    }
  }

  async mostrarAlert(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
