import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicSharedModule } from 'src/app/shared.module';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { UserdataService } from '../../servicio/user/userdata.service';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicSharedModule],
})
export class EscanearPage implements AfterViewInit {
  qrResult: string | null = null;
  idUsuario: string | null = null; // Agregar la propiedad idUsuario

  constructor(
    private databaseService: DatabaseService,
    private userdataService: UserdataService
  ) {}

  ngAfterViewInit(): void {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    const verbose = false;
    const scanner = new Html5QrcodeScanner('reader', config, verbose);

    // Obtener el ID del usuario logueado
    this.idUsuario = this.userdataService.getUserId()?.toString() || null;

    if (!this.idUsuario) {
      console.error('No se pudo obtener el ID del usuario logueado.');
      return;
    }

    scanner.render(
      (decodedText) => {
        console.log('QR Escaneado:', decodedText);

        try {
          const data = JSON.parse(decodedText); // Decodifica el QR
          const idClase = data.id_clase;

          console.log('ID Usuario:', this.idUsuario);

          if (idClase && this.idUsuario) {
            // Llamar al método para actualizar la asistencia
            this.updateAsistencia(idClase, this.idUsuario); 
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
