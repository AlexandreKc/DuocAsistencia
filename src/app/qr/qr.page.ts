import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage {
  qrUrl: string | null = null; // Propiedad para almacenar la URL del QR

  constructor(private http: HttpClient, private alertController: AlertController) {}

  async generarQR(contenido: string) {
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(contenido)}`;

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: async (data) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Código QR generado exitosamente.',
          buttons: ['OK'],
        });
        await alert.present();

        // Mostrar la imagen generada
        this.qrUrl = URL.createObjectURL(data);
        console.log('QR generado:', this.qrUrl);
      },
      error: async (err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo generar el código QR. Inténtalo de nuevo.',
          buttons: ['OK'],
        });
        await alert.present();
        console.error('Error al generar el QR:', err);
      },
    });
  }
}
