import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AfterViewInit } from '@angular/core';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { UserdataService } from 'src/app/servicio/user/userdata.service';
import { EstadoserviceService } from 'src/app/servicio/estado/estadoservice.service';
import { AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MenuserviceService } from 'src/app/servicio/menu/menuservice.service';
import { IonicSharedModule } from 'src/app/shared.module';
import { WeatherService } from 'src/app/servicio/APIclima/weather.service.spec';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonicSharedModule]
})
export class HomePage implements OnInit, AfterViewInit {
  username: string = "";
  isAdmin: boolean = false;  // Inicializamos isAdmin en false
  id_user: number | null = null;  // Para almacenar el tipo de usuario
  correo: string = "";  // Para almacenar el correo del usuario
  contrasena: string = "" //almacenar la contraseña
  weatherData: any;  // Para almacenar los datos del clima
  city: string = 'Llanquihue';  // Ciudad por defecto


  openMenu() {
    this.menuService.openMenu();  // Llama al servicio para abrir el menú
  }

  constructor(
    private estadoService: EstadoserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private animationCtrl: AnimationController,
    private cdr: ChangeDetectorRef,
    private menuController: MenuController,
    private menuService: MenuserviceService,
    private userService: UserdataService,  // Añadir UserService al constructor
    private weatherService: WeatherService
  ) {}

  

  ngOnInit() {

    // Obtener los datos del usuario desde el UserService
    const userData = this.userService.getUserData();
    this.getWeather(this.city);
    if (userData) {
      this.username = userData.nombre;
      this.id_user = userData.id_tp_usuario;
      this.correo = userData.correo;
      this.contrasena = userData.contrasena;

      // Verifica si el usuario es administrador
      this.isAdmin = this.id_user === 2; // Ejemplo: Asumimos que el tipo 2 es administrador
    } else {
      console.error('No se pudo recuperar la información del usuario');
    }
  }

  getWeather(city: string) {
    this.weatherService.getWeather(city).subscribe(
      data => {
        this.weatherData = data;  // Almacena los datos obtenidos
      },
      error => {
        console.error('Error fetching weather data:', error);  // Maneja errores
      }
    );
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
  
  ngAfterViewInit() {
    // Forzar la detección de cambios para iniciarlo
    this.cdr.detectChanges();
    // Esto es para hacer que la animación espere para entrar
    setTimeout(() => this.animarTexto(), 30);
  }

  animarTexto() {
    const texto = document.querySelector('.texto-desvanecido');
    if (texto) {
      const animacion = this.animationCtrl.create()
        .addElement(texto)
        .duration(1500)
        .fromTo('opacity', '0', '1');
      animacion.play();
    } else {
      console.error('No se pudo encontrar un elemento con la clase .texto-desvanecido');
    }
  }
  navigateToGestion() {
    this.router.navigate(['/gestion']);
  }
  navigateToAsistencia() {
    this.router.navigate(['/conteoasistencia']);
  }
  navigateToEscanear() {
    this.router.navigate(['/escanear']);
  }
  navigateToAdmin() {
    this.router.navigate(['/administrarcuentas']);
  }

  ionViewWillEnter() {
    // console.log('La vista está a punto de ser mostrada en pantalla');
    this.menuController.enable(true, 'menuId');  // Activa el menú al entrar a la página
  }

  // ionViewDidEnter() {
  //   console.log('La vista ha cargado y es visible en la pantalla');
  // }

  // ionViewWillLeave() {
  //   console.log('La vista saldrá de la pantalla');
  //   this.menuController.enable(false, 'menuId');  // Desactiva el menú al salir de la página
  // }

  // ionViewDidLeave() {
  //   console.log('La vista se ha ido');
  // }

  // ngOnDestroy() {
  //   console.log('El componente está a punto de ser destruido');
  // }

}
