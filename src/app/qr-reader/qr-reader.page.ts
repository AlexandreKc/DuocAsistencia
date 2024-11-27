import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowserMultiFormatReader } from '@zxing/browser';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.page.html',
  styleUrls: ['./qr-reader.page.scss'],
})
export class QrReaderPage implements OnInit, OnDestroy {
  private codeReader: BrowserMultiFormatReader;
  scanning: boolean = false;
  private currentStream: MediaStream | null = null;

  constructor() {
    this.codeReader = new BrowserMultiFormatReader();
  }

  ngOnInit() {
    this.startScanner();
  }

  /**
   * Inicia el escaneo de códigos QR
   */
  startScanner() {
    const videoElement = document.getElementById('video') as HTMLVideoElement;
  
    // Verifica si ya tenemos acceso a la cámara
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Si el usuario da permiso, configuramos el flujo de video
        this.currentStream = stream;
        videoElement.srcObject = stream;
  
        // Obtener los dispositivos de video disponibles
        navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const firstDeviceId = videoDevices[0]?.deviceId; // Obtener el primer dispositivo de video disponible
  
            if (!firstDeviceId) {
              console.error('No se encontraron dispositivos de video.');
              alert('No se pudo acceder a la cámara. Verifica los permisos.');
              return;
            }
  
            // Usar el primer dispositivo de video encontrado
            this.codeReader.decodeFromVideoDevice(firstDeviceId, videoElement, (result, error) => {
              if (result) {
                const qrContent = result.getText() || 'Sin contenido';
                console.log('QR Detectado:', qrContent);
                alert(`Código QR leído: ${qrContent}`);
                this.stopScanner();  // Detener el escaneo después de leer el QR
              }
              if (error) {
                console.warn('Error durante el escaneo (esperado):', error.message);
              }
            });
          })
          .catch(err => {
            console.error('Error al obtener dispositivos de video:', err);
            alert('No se pudo acceder a la cámara. Verifica los permisos.');
          });
  
        this.scanning = true;
      })
      .catch(err => {
        // Si el usuario niega el permiso
        console.error('Permiso denegado o error al acceder a la cámara:', err);
        alert('Se requiere permiso para acceder a la cámara. Por favor, habilita los permisos de la cámara en tu navegador.');
      });
  }
  

  /**
   * Detiene el escaneo y libera la cámara
   */
  stopScanner() {
    if (this.currentStream) {
      const tracks = this.currentStream.getTracks();
      tracks.forEach(track => track.stop()); // Detener todos los tracks de la cámara
      this.currentStream = null; // Limpiar la referencia a la cámara
    }
    this.scanning = false;
  }

  /**
   * Limpia los recursos al destruir el componente
   */
  ngOnDestroy() {
    this.stopScanner();
  }
}
