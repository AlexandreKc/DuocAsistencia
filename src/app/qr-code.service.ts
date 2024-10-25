import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  private apiUrl = 'https://api.qrserver.com/v1/create-qr-code/';

  constructor(private http: HttpClient) {}

  generateQrCode(data: string, size: string = '200x200') {
    const url = `${this.apiUrl}?data=${encodeURIComponent(data)}&size=${size}`;
    return url; // Retorna la URL del QR generado
  }
}
