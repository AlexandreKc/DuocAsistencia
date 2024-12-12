import { Component, OnInit } from '@angular/core';
import { QRScanner } from '@ionic-native/qr-scanner/ngx'; // Importar QRScanner
import { DatabaseService } from '../../database/database.service'; // Tu servicio de base de datos

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  constructor(
    private qrScanner: QRScanner, // Inyectamos el QRScanner
    private database: DatabaseService
  ) {}

  ngOnInit() {
    this.startScanning();
  }

  startScanning() {
    this.qrScanner.prepare().then((status) => {
      if (status.authorized) {
        this.qrScanner.scan().subscribe({
          next: (scanResult: string) => {
            const qrData = scanResult; 
            this.handleScanResult(qrData);
          },
          error: (err) => {
            console.error('Error al escanear el QR', err);
          }
        });
      } else {
        console.error('No autorizado para usar la cámara');
      }
    });
  }
  
  handleScanResult(qrData: string) {
    // Extraemos los valores de id_clase e id_usuario del QR
    const params = new URLSearchParams(qrData);
    const idClase = params.get('id_clase');
    const idUsuario = params.get('id_usuario');

    if (idClase && idUsuario) {
      // Llamar al backend para actualizar la base de datos
      this.updateAsistencia(idClase, idUsuario);
    } else {
      console.error('QR no contiene los parámetros esperados');
    }
  }

  updateAsistencia(idClase: string, idUsuario: string) {
    // Llamamos a tu servicio de base de datos para actualizar el id_tp_asistencia
    this.database.updateAsistencia(idClase, idUsuario).subscribe(
      (response) => {
        console.log('Asistencia actualizada con éxito:', response);
      },
      (error) => {
        console.error('Error al actualizar asistencia:', error);
      }
    );
  }
}
