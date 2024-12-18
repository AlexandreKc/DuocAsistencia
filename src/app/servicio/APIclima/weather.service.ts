import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  async fetchWeather(params: any): Promise<any> {
    try {
      const response = await this.http
        .get<any>(this.apiUrl, { params })
        .toPromise();
      return response; // Devuelve la respuesta completa
    } catch (error) {
      console.error('Error en la API del clima:', error);
      throw error;
    }
  }
}
