import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage {
  constructor(private http: HttpClient, private alertController: AlertController) {}

  async generarQR(contenido: string) {
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(contenido)}`;

    this.http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: async (data) => {
        // Mostrar alerta de éxito
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Código QR generado exitosamente.',
          buttons: ['OK'],
        });
        await alert.present();

        // Hacer algo con el QR, por ejemplo, mostrar la imagen
        const qrUrl = URL.createObjectURL(data);
        // Aquí podrías mostrar la imagen generada
        console.log('QR generado:', qrUrl);
      },
      error: async (err) => {
        // Mostrar alerta de error
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
