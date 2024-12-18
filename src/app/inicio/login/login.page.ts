import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { UserdataService } from 'src/app/servicio/user/userdata.service';
import { IonicSharedModule } from 'src/app/shared.module';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonicSharedModule]
})
export class LoginPage implements OnInit {
  correo: string = "";      // Campo para el correo
  password: string = "";    // Campo para la contraseña
  passwordType: string = 'password'; // Para manejar la visibilidad de la contraseña
  
  constructor(
    private router: Router,
    private alertController: AlertController,
    private database: DatabaseService, // Inyecta el servicio de base de datos
    private userService: UserdataService    // Inyecta el servicio de usuario
  ) {
  }
  
  
  ngOnInit() {
    // Verificar si el usuario ya está logueado al inicio
    if (this.userService.isUserLoggedIn()) {
      // Si ya está logueado, redirigir al home
      this.router.navigate(['/home']);
    }
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
  async login() {
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
              id: response.id, // Asegúrate de que el id esté en la respuesta
            };
            this.userService.setUserData(userData); // Guardamos los datos en el UserService
  
            // Toast de éxito
            await Toast.show({
              text: 'Sesión iniciada correctamente.',
              duration: 'short',
              position: 'bottom',
            });
  
            // Redirigir automáticamente al home
            this.router.navigate(['/home'], {
              queryParams: {
                username: userData.nombre,
                id_Tp_Usuario: userData.id_tp_usuario,
              },
            });
          } else {
            // Si las credenciales son incorrectas
            await Toast.show({
              text: 'Correo o contraseña incorrectos.',
              duration: 'short',
              position: 'bottom',
            });
          }
        },
        async (error) => {
          // Si ocurre un error, muestra toast de servidor desconectado
          console.error('Error en el servidor:', error);
          await Toast.show({
            text: 'Error al iniciar sesión, servidor desconectado.',
            duration: 'short',
            position: 'bottom',
          });
        }
      );
    } else {
      // Si no se completan los campos
      await Toast.show({
        text: 'Por favor, completa todos los campos correctamente.',
        duration: 'short',
        position: 'bottom',
      });
    }
  }
  
  
}
