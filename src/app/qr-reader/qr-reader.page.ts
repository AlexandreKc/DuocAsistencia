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

    // Obtener dispositivos de video disponibles
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoDevices.length === 0) {
          console.error('No se encontraron dispositivos de video.');
          alert('No se encontró ninguna cámara disponible.');
          return;
        }

        // Intentar encontrar la cámara trasera
        const backCamera = videoDevices.find(device =>
          device.label.toLowerCase().includes('back')
        );

        const selectedDeviceId = backCamera?.deviceId || videoDevices[videoDevices.length - 1]?.deviceId; // Elegir la trasera o la última cámara disponible

        if (!selectedDeviceId) {
          console.error('No se pudo seleccionar una cámara.');
          alert('No se pudo acceder a la cámara. Verifica los permisos.');
          return;
        }

        // Solicitar acceso a la cámara seleccionada
        navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } }
        }).then(stream => {
          this.currentStream = stream;
          videoElement.srcObject = stream;

          // Inicializar el escaneo del código QR
          this.codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, error) => {
            if (result) {
              const qrContent = result.getText() || 'Sin contenido';
              console.log('QR Detectado:', qrContent);
              alert(`Código QR leído: ${qrContent}`);
              this.stopScanner(); // Detener el escaneo
            }
            if (error) {
              console.warn('Error durante el escaneo (esperado):', error.message);
            }
          });

          this.scanning = true;
        }).catch(err => {
          console.error('Error al acceder a la cámara:', err);
          alert('No se pudo acceder a la cámara. Verifica los permisos.');
        });
      })
      .catch(err => {
        console.error('Error al enumerar dispositivos:', err);
        alert('No se pudo obtener la lista de cámaras.');
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
