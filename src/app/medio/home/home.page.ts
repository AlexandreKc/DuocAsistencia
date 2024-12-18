import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AnimationController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { MenuserviceService } from 'src/app/servicio/menu/menuservice.service';
import { IonicSharedModule } from 'src/app/shared.module';
import { UserdataService } from 'src/app/servicio/user/userdata.service';
import { WeatherService } from 'src/app/servicio/APIclima/weather.service';

import { Network, ConnectionStatus } from "@capacitor/network";//para el pluging

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicSharedModule]
})
export class HomePage implements OnInit, AfterViewInit {
  username: string = "";
  isAdmin: boolean = false;
  id_user: number | null = null;
  correo: string = "";
  contrasena: string = "";
  weatherData: any;
  city: string = 'Puerto Montt';

  status: string ="";//pluging
  connectionType: string ="";//pluging

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private animationCtrl: AnimationController,
    private cdr: ChangeDetectorRef,
    private menuController: MenuController,
    private menuService: MenuserviceService,
    private userService: UserdataService,
    private weatherService: WeatherService,
    private change: ChangeDetectorRef,//pluging
  ) {}

  ngOnInit() {

    this.getNetworkStatus();//pluging

    const userData = this.userService.getUserData();
    if (userData) {
      this.username = userData.nombre;
      this.id_user = userData.id_tp_usuario;
      this.correo = userData.correo;
      this.contrasena = userData.contrasena;
      this.isAdmin = this.id_user === 2;
    } else {
      console.error('No se pudo recuperar la información del usuario');
    }

    // Llamar a la API del clima
    this.getWeatherData();
  }


  //pluging de conexion
  getNetworkStatus(){
    Network.getStatus().then(
      (status:ConnectionStatus)=>{
        this.status = (status.connected)?
        "Conectado":"Desconectado";
        this.connectionType = status.connectionType;
      })
  }

  onNetworkChanged(){
    Network.addListener("networkStatusChange", (status)=>{
      this.status = (status.connected)?
      "Conectado":"Desconectado";
      this.connectionType = status.connectionType;
      this.change.detectChanges();

    })
  }

//Obtener el clima
  async getWeatherData() {
    const params = {
      latitude: -41.4717, // Puerto Montt
      longitude: -72.9364,
      hourly: ['temperature_2m', 'precipitation_probability', 'rain'],
      daily: ['temperature_2m_max', 'temperature_2m_min'],
      current_weather: true,
      forecast_days: 5,
      timezone: 'auto'
    };
  
    try {
      const response = await this.weatherService.fetchWeather(params);
  
      console.log('Respuesta de la API:', response);
  
      if (response && response.current_weather) {
        this.weatherData = {
          temperature: response.current_weather.temperature,
          forecast: response.daily.time.map((time: any, index: number) => ({
            day: new Date(time).toLocaleDateString(),
            temperatureMax: response.daily.temperature_2m_max[index],
            temperatureMin: response.daily.temperature_2m_min[index]
          }))
        };
      } else if (response && response.daily) {
        this.weatherData = {
          temperature: 'No disponible (usando valores diarios)',
          forecast: response.daily.time.map((time: any, index: number) => ({
            day: new Date(time).toLocaleDateString(),
            temperatureMax: response.daily.temperature_2m_max[index],
            temperatureMin: response.daily.temperature_2m_min[index]
          }))
        };
      } else {
        console.error('La respuesta no contiene datos válidos:', response);
      }
  
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al obtener los datos del clima:', error);
    }
  }
  
  // Método para obtener el ícono del clima basado en las condiciones actuales
  getWeatherIcon(): string {
    if (!this.weatherData || !this.weatherData.temperature) {
      return 'help-circle'; // Icono por defecto si no hay datos
    }
    const temperature = this.weatherData.temperature;
    const forecast = this.weatherData.forecast;
    const rainProbability = forecast?.[0]?.rainProbability || 0;
    const isRaining = rainProbability > 50;

    if (isRaining) {
      return 'rainy';
    } else if (temperature >= 30) {
      return 'sunny';
    } else if (temperature >= 20 && temperature < 30) {
      return 'partly-sunny';
    } else if (temperature < 20) {
      return 'cloudy';
    }
    return 'cloudy'; // Ícono por defecto
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
    }
  }

  // Navegaciones
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
    this.menuController.enable(true, 'menuId');
  }
}
