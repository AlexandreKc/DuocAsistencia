import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicSharedModule } from 'src/app/shared.module';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { ActivatedRoute } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicSharedModule],
})
export class DetallePage implements OnInit, OnDestroy {
  idMateria: string | null = null;
  idClase: string | null = null; // Variable para almacenar idClase
  alumnos: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  qrCode: string | null = null;
  intervalId: any; // Variable para almacenar el ID del intervalo

  constructor(private route: ActivatedRoute, private database: DatabaseService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.idMateria = params['idMateria']; // Obtener idMateria de los queryParams
      this.idClase = params['idClase']; // Obtener idClase de los queryParams

      if (this.idClase) {
        this.generarQR(); // Generar QR con idClase
      } else {
        this.error = 'ID de la clase no recibido. Verifica los parámetros.';
        console.error(this.error);
      }

      if (this.idMateria) {
        this.cargarAlumnos(); // Cargar alumnos relacionados a idMateria

        // Configurar el intervalo para recargar los alumnos cada 30 segundos
        this.startInterval();
      } else {
        this.error = 'ID de la materia no recibido. Verifica los parámetros.';
        console.error(this.error);
      }
    });
  }

  ngOnDestroy() {
    this.clearInterval(); // Detener el intervalo cuando se destruya el componente
  }

  startInterval() {
    this.clearInterval(); // Asegurarte de que no hay intervalos duplicados

    this.intervalId = setInterval(() => {
      if (this.idClase) { // Solo ejecutar si hay una clase activa
        this.cargarAlumnos();
      }
    }, 30000);
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null; // Reiniciar el valor
    }
  }

  cargarAlumnos() {
    this.loading = true;
    this.error = null;
  
    if (this.idClase) { // Asegurarte de que tienes un idClase disponible
      this.database.getAlumnosPorClase(parseInt(this.idClase)).subscribe(
        (response) => {
          this.alumnos = response.alumnos || [];
          console.log('Alumnos actualizados (por clase):', this.alumnos);
          this.loading = false;
        },
        (error) => {
          console.error('Error al cargar alumnos por clase:', error);
          this.error = 'No se pudieron cargar los alumnos. Intenta nuevamente.';
          this.loading = false;
        }
      );
    } else {
      console.error('No se recibió idClase para cargar alumnos.');
      this.error = 'ID de la clase no definido.';
      this.loading = false;
    }
  }

  generarQR() {
    if (this.idClase) { // Usar idClase para generar el QR
      const qrData = JSON.stringify({ id_clase: this.idClase });
      console.log('Datos para el QR:', qrData);

      QRCode.toDataURL(qrData, (err, url) => {
        if (err) {
          console.error('Error al generar el QR:', err);
        } else {
          this.qrCode = url; // Almacena la URL del QR generado
        }
      });
    } else {
      console.error('Faltan datos para generar el QR');
    }
  }
}
