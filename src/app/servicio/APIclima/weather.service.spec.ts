import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  async getWeather(latitude: number, longitude: number, forecastDays: number = 3) {
    const params = {
      latitude: latitude,
      longitude: longitude,
      current: 'temperature_2m',
      hourly: ['temperature_2m', 'precipitation_probability', 'rain'],
      daily: ['temperature_2m_max', 'temperature_2m_min'],
      forecast_days: forecastDays,
    };
};
}