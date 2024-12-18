import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { ChangeDetectorRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular/standalone';
import { UserdataService } from './servicio/user/userdata.service';
import { MenuserviceService } from './servicio/menu/menuservice.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicSharedModule } from './shared.module';
import { WeatherService } from './servicio/APIclima/weather.service.spec'; // Asegúrate de que WeatherService esté configurado

//Solicitud de permisos?
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    RouterLink,
    IonicSharedModule,
    RouterOutlet
  ],
})
export class AppComponent implements OnInit {
  isAdmin: boolean = false;
  showMenu: boolean = false;
  weatherData: any;
  city: string = 'Llanquihue'; // Ciudad por defecto
  username: string = 'Usuario'; // Nombre de usuario (esto puede ser dinámico)
  
  constructor(
    private menuService: MenuserviceService,
    private userService: UserdataService,
    private platform: Platform,
    private menuController: MenuController,
    private cd: ChangeDetectorRef,
    private router: Router,
    private weatherService: WeatherService // Servicio del clima
  ) {}

  ngOnInit() {
    this.initializeApp();
    this.weatherData(); // Cargar datos del clima cuando la app inicie
    this.requestPermissions(); 
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.userService.loadUserData();
      this.userService.isUserLoggedIn().subscribe((loggedIn) => {
        if (loggedIn) {
          this.checkAdminStatus();
        } else {
          this.menuController.enable(false);
          console.log('Menú desactivado');
        }
      });
    });
  }
  private async requestPermissions() {
    try {
      // Solicitar permiso de cámara
      const cameraStatus = await Camera.requestPermissions();
      console.log('Permiso de cámara:', cameraStatus.camera);

      // Solicitar permiso de ubicación
      const locationStatus = await Geolocation.requestPermissions();
      console.log('Permiso de ubicación:', locationStatus.location);

      // Verifica si ambos permisos fueron concedidos
      if (cameraStatus.camera === 'granted' && locationStatus.location === 'granted') {
        console.log('Todos los permisos fueron concedidos');
      } else {
        console.warn('Uno o más permisos fueron denegados');
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  }

  checkAdminStatus() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.isAdmin = userData.id_tp_usuario === 2; // Verificar si es administrador
      console.log('Usuario administrador:', this.isAdmin);
      this.menuController.enable(true);
      this.cd.detectChanges(); // Forzar la detección de cambios
    } else {
      this.isAdmin = false;
      this.cd.detectChanges();
    }
  }

  openMenu() {
    this.menuController.open();
  }

  logout() {
    this.userService.clearUserData();
    this.menuController.enable(false);
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

}
