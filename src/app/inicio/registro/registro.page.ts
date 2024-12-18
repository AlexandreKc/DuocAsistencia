import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { AlertController } from '@ionic/angular';
import { IonicSharedModule } from 'src/app/shared.module';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicSharedModule]
})
export class RegistroPage {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  
  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private alertController: AlertController
  ) {}
  
  async registrarse() {
    if (this.contrasena !== this.confirmarContrasena) {
      this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    
    // Validar correo y contraseña
    if (this.correo.length < 12 || this.correo.length > 70) {
      this.presentAlert('Error', 'El correo debe tener entre 12 y 70 caracteres.');
      return;
    }
    
    if (this.contrasena.length < 6 || this.contrasena.length > 15) {
      this.presentAlert('Error', 'La contraseña debe tener entre 6 y 15 caracteres.');
      return;
    }
    // Crear nuevo usuario
    const nuevoUsuario = {
      nombre: this.nombre,
      correo: this.correo,
      contrasena: this.contrasena,
      id_tp_usuario: 2 // Ejemplo de tipo de usuario predeterminado (puedes cambiarlo)
    };
    
    this.dbService.registrarUsuario(nuevoUsuario).subscribe(
      (response) => {
        this.presentAlert('Éxito', 'Usuario registrado con éxito.');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.presentAlert('Error de datos', 'Datos inválidos o sin rellenar, por favor verifica los campos.');
        console.error(error);
      }
    );
  }
  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}