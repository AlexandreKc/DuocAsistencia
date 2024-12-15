import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicSharedModule } from 'src/app/shared.module';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { UserdataService } from 'src/app/servicio/user/userdata.service';

@Component({
  selector: 'app-conteoasistencia',
  templateUrl: './conteoasistencia.page.html',
  styleUrls: ['./conteoasistencia.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicSharedModule],
})
export class ConteoasistenciaPage implements OnInit {
  idUsuario: string | null = null;
  materias: any[] = [];
  conteos: { [key: string]: { asistencias: number; totalClases: number } } = {};
  loading: boolean = false;
  error: string | null = null;

  mostrarModal: boolean = false; // Controla la visibilidad del modal
  clasesFaltantes: any[] = []; // Almacena las clases faltantes
  materiaSeleccionada: any = null; // Almacena la materia seleccionada para el modal

  constructor(
    private databaseService: DatabaseService,
    private userDataService: UserdataService
  ) {}

  ngOnInit() {
    this.idUsuario = this.userDataService.getUserId()?.toString() || null;

    if (this.idUsuario) {
      console.log('Usuario logueado con ID:', this.idUsuario);
      this.cargarMaterias();
    } else {
      this.error = 'No se pudo identificar al usuario logueado.';
      console.error(this.error);
    }
  }

  cargarMaterias() {
    this.loading = true;
  
    this.databaseService.getMaterias(Number(this.idUsuario)).subscribe(
      (response) => {
        console.log('Respuesta de materias:', response); // Agregado para depurar
        if (response?.length) {
          this.materias = response;
          this.cargarConteosAsistencia();
        } else {
          this.error = 'No se encontraron materias asociadas al usuario.';
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar materias:', error);
        this.error = 'No se pudieron cargar las materias. Intenta nuevamente.';
        this.loading = false;
      }
    );
  }
  

  cargarConteosAsistencia() {
    if (!this.materias.length || !this.idUsuario) {
      return;
    }

    const conteosTemporal: { [key: string]: { asistencias: number; totalClases: number } } = {};
    const observables = this.materias.map((materia) =>
      this.databaseService
        .getConteoAsistencia(this.idUsuario!, materia.materia_id)
        .toPromise()
        .then((response) => {
          const conteoMateria = response.find((item: any) => item.materia_id === materia.materia_id);
          conteosTemporal[materia.materia_id] = conteoMateria
            ? {
                asistencias: parseInt(conteoMateria.total_asistencias, 10) || 0,
                totalClases: parseInt(conteoMateria.total_clases, 10) || 0,
              }
            : { asistencias: 0, totalClases: 0 };
        })
        .catch(() => {
          conteosTemporal[materia.materia_id] = { asistencias: 0, totalClases: 0 };
        })
    );

    Promise.all(observables).then(() => {
      this.conteos = conteosTemporal;
    });
  }

  verClasesFaltantes(materia: any) {
    if (!materia || !materia.materia_id) {
      console.error('La materia seleccionada no es válida.');
      return;
    }

    const materiaId = materia.materia_id;

    const idUsuario = this.idUsuario;
    if (!idUsuario) {
      console.error('No se pudo obtener el ID del usuario logueado.');
      return;
    }

    this.databaseService.getClasesFaltantes(idUsuario, materiaId).subscribe(
      (response) => {
        this.clasesFaltantes = response || [];
        this.materiaSeleccionada = materia;
        this.mostrarModal = true; // Mostrar el modal
      },
      (error) => {
        console.error(`Error al obtener las clases faltantes para la materia ${materiaId}:`, error);
      }
    );
  }

  cerrarModal() {
    this.mostrarModal = false; // Oculta el modal
    this.clasesFaltantes = [];
    this.materiaSeleccionada = null;
  }
}
