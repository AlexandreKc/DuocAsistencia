import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/database/database.service';
import * as QRCode from 'qrcode';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  idMateria: string | null = null;
  alumnos: any[] = [];
  loading: boolean = false;
  error: string | null = null; 
  qrCode: string | null = null;
  idUsuario: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.idMateria = params['idMateria']; 

      if (this.idMateria) {
        this.cargarAlumnos();
      } else {
        this.error = 'ID de la materia no recibido. Verifica los parámetros.';
        console.error(this.error);
      }
    });
  }

  cargarAlumnos() {
    this.loading = true; 
    this.error = null; 

    this.database.getAlumnosDeMateria(this.idMateria!).subscribe(
      (response) => {
        this.alumnos = response.alumnos || [];
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar alumnos:', error);
        this.error = 'No se pudieron cargar los alumnos. Intenta nuevamente.';
        this.loading = false; 
      }
    );
  }
  generarQR() {
    if (this.idMateria && this.idUsuario) { // Asegúrate de que ambos valores existan
      const qrData = `id_clase:${this.idMateria}&id_usuario:${this.idUsuario}`;
      
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
