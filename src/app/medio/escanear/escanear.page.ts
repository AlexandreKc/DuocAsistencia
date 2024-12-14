import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AfterViewInit } from '@angular/core';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { UserdataService } from '../../servicio/user/userdata.service'; 
@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EscanearPage implements AfterViewInit {
  qrResult: string | null = null;

  constructor(private databaseService: DatabaseService, private userdataService: UserdataService) {}

  ngAfterViewInit(): void {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const verbose = false;
    const scanner = new Html5QrcodeScanner('reader', config, verbose);

    scanner.render(
      (decodedText) => {
        console.log('QR Escaneado:', decodedText);

        try {
          const data = JSON.parse(decodedText); // Decodifica el QR
          const idClase = data.id_clase;

          // Obtener el ID del usuario logueado desde el servicio
          const idUsuario = this.userdataService.getUserId(); 
          console.log('ID Usuario:', idUsuario);

          if (idClase && idUsuario) {
            // Llamar al método para actualizar la asistencia
            this.updateAsistencia(idClase, idUsuario.toString()); 
            // Convertimos a string si es necesario
          } else {
            console.error('Datos incompletos: idClase o idUsuario no encontrados.');
            alert('No se pudo registrar la asistencia. Verifique sus datos.');
          }
        } catch (error) {
          console.error('Error al interpretar el contenido del QR:', error);
          alert('Código QR inválido.');
        }

        scanner.clear();
      },
      (error) => {
        console.error('Error al escanear el QR:', error);
      }
    );
  }

  updateAsistencia(idClase: string, idUsuario: string): void {
    console.log('Llamando a updateAsistencia con:', { idClase, idUsuario });
    
    this.databaseService.updateAsistencia(idClase, idUsuario).subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        alert('Asistencia registrada con éxito');
      },
      (error) => {
        console.error('Error en el servidor:', error);
        alert('Hubo un error al registrar la asistencia.');
      }
    );
  }
}