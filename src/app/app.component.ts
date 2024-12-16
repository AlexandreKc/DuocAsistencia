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
  city: string = 'Puerto Montt'; // Ciudad por defecto
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
    this.loadWeatherData(); // Cargar datos del clima cuando la app inicie
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

  // Función para cargar los datos del clima
  loadWeatherData() {
    this.weatherService.getWeather(this.city).subscribe(data => {
      this.weatherData = data;
      console.log(this.weatherData); // Verifica los datos recibidos
    });
  }

  // Función para determinar el ícono del clima
  getWeatherIcon() {
    if (this.weatherData) {
      const description = this.weatherData.description.toLowerCase();
      if (description.includes('cloudy') || description.includes('nublado')) {
        return 'cloud'; // Ícono de nube
      } else if (description.includes('rain') || description.includes('lluvia')) {
        return 'rainy'; // Ícono de lluvia
      } else if (description.includes('sun') || description.includes('soleado')) {
        return 'sunny'; // Ícono de sol
      }
    }
    return 'partly-sunny'; // Ícono por defecto si no se encuentra una descripción
  }
}
