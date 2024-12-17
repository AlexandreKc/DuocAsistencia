import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicSharedModule } from 'src/app/shared.module';
import { Html5Qrcode } from 'html5-qrcode';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { UserdataService } from '../../servicio/user/userdata.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicSharedModule],
})
export class EscanearPage implements AfterViewInit, OnDestroy {
  qrResult: string | null = null;
  idUsuario: string | null = null;
  html5QrCode: Html5Qrcode | null = null;
  scanning: boolean = false; 
  private isActive: boolean = true;

  constructor(
    private databaseService: DatabaseService,
    private userdataService: UserdataService,
    private toastController: ToastController
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.idUsuario = this.userdataService.getUserId()?.toString() || null;
    this.isActive = true; // Página activa
  
    if (!this.idUsuario) {
      console.error('No se pudo obtener el ID del usuario logueado.');
      return;
    }
  
    try {
      const devices = await Html5Qrcode.getCameras();
  
      if (devices && devices.length > 0) {
        const backCamera = devices.find((device) =>
          device.label.toLowerCase().includes('back')
        );
  
        const cameraId = backCamera ? backCamera.id : devices[0].id;
  
        this.html5QrCode = new Html5Qrcode('reader');
        await this.html5QrCode.start(
          { deviceId: { exact: cameraId } }, // Configurar la cámara trasera
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (this.isActive && !this.scanning) {
              this.scanning = true;
              this.handleScanSuccess(decodedText);
            }
          },
          (error) => {
            if (this.isActive) {
              console.warn('No se pudo escanear el QR:', error);
            }
          }
        );
      } else {
        console.error('No se encontraron cámaras.');
        alert('No se pudo acceder a la cámara.');
      }
    } catch (error) {
      if (this.isActive) {
        console.error('Error al inicializar las cámaras:', error);
      }
    }
  }
  
  ngOnDestroy(): void {
    this.isActive = false; 
    this.stopScanning();
  }

  async stopScanning(): Promise<void> {
    if (this.html5QrCode && this.html5QrCode.isScanning) {
      try {
        await this.html5QrCode.stop();
        console.log('Escaneo detenido correctamente.');
      } catch (err) {
        console.error('Error al detener el escaneo:', err);
      }
    }
    this.html5QrCode = null;
    this.scanning = false;
  }
  
  async handleScanSuccess(decodedText: string): Promise<void> {
    console.log('QR Escaneado:', decodedText);

    try {
      const data = JSON.parse(decodedText);
      const idClase = data.id_clase;

      if (idClase && this.idUsuario) {
        await this.updateAsistencia(idClase, this.idUsuario); // Registrar la asistencia
      } else {
        console.error('Datos incompletos: idClase o idUsuario no encontrados.');
        alert('No se pudo registrar la asistencia. Verifique sus datos.');
      }
    } catch (error) {
      console.error('Error al interpretar el contenido del QR:', error);
      alert('Código QR inválido.');
    }

    // Detener el escaneo tras leer un código y permitir una nueva lectura
    this.scanning = false;
  }

  async updateAsistencia(idClase: string, idUsuario: string): Promise<void> {
    console.log('Llamando a updateAsistencia con:', { idClase, idUsuario });

    this.databaseService.updateAsistencia(idClase, idUsuario).subscribe(
      async (response) => {
        console.log('Respuesta del servidor:', response);

        // Mostrar un toast al registrar la asistencia
        const toast = await this.toastController.create({
          message: 'Asistencia registrada con éxito',
          duration: 2000,
          color: 'success',
          position: 'bottom',
        });
        toast.present();
      },
      async (error) => {
        console.error('Error en el servidor:', error);

        // Mostrar un toast si ocurre un error
        const toast = await this.toastController.create({
          message: 'Hubo un error al registrar la asistencia',
          duration: 2000,
          color: 'danger',
          position: 'bottom',
        });
        toast.present();
      }
    );
  }
}
