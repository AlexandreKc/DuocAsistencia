import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/database/database.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  idMateria: string | null = null;
  alumnos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private database: DatabaseService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.idMateria = params['idMateria']; 
      console.log('idMateria recibido:', this.idMateria);  

      if (this.idMateria) {
        this.cargarAlumnos();
      } else {
        console.error('Error al recibir ID materia, Posiblemente por QueryParams.');
      }
    });
  }

  cargarAlumnos() {
    if (!this.idMateria) {
      console.error('idMateria no está definido.');
      return;
    }

    this.database.getAlumnosDeMateria(this.idMateria).subscribe(
      (response) => {
        console.log('Alumnos obtenidos:', response);
        this.alumnos = response.alumnos || [];
      },
      (error) => {
        console.error('Error al cargar alumnos:', error);
      }
    );
  }
}
