import { Component, OnInit } from '@angular/core';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { DatabaseService } from '../../database/database.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scan.page.html',  // Asegúrate que la ruta del template sea la correcta
  styleUrls: ['./scan.page.scss'], // Asegúrate que la ruta de los estilos sea la correcta
})
export class ScannerPage implements OnInit {
  isScanning: boolean = false;  // Define isScanning
  scanResult: string | null = null;  // Define scanResult

  constructor(
    private qrScanner: QRScanner,
    private database: DatabaseService
  ) {}

  ngOnInit() {
    this.startScanning();
  }

  startScanning() {
    this.isScanning = true; // Establece isScanning como true cuando comiences a escanear
    this.qrScanner.prepare().then((status) => {
      if (status.authorized) {
        this.qrScanner.scan().subscribe({
          next: (scanResult: string) => {
            this.isScanning = false;  // Deja de escanear después de obtener el resultado
            this.scanResult = scanResult; // Guarda el resultado del escaneo
            this.handleScanResult(scanResult);
          },
          error: (err) => {
            console.error('Error al escanear el QR', err);
            this.isScanning = false; // Detén el escaneo en caso de error
          }
        });
      } else {
        console.error('No autorizado para usar la cámara');
      }
    });
  }

  handleScanResult(qrData: string) {
    const params = new URLSearchParams(qrData);
    const idClase = params.get('id_clase');
    const idUsuario = params.get('id_usuario');

    if (idClase && idUsuario) {
      this.updateAsistencia(idClase, idUsuario);
    } else {
      console.error('QR no contiene los parámetros esperados');
    }
  }

  updateAsistencia(idClase: string, idUsuario: string) {
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
