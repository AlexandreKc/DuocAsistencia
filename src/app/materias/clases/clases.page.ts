import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../database/database.service';  // Asumiendo que tienes un servicio para obtener las clases

@Component({
  selector: 'app-clases',
  templateUrl: './clases.page.html',
  styleUrls: ['./clases.page.scss'],
})
export class ClasesPage implements OnInit {
  idMateria: number | null = null;  // Inicializado como null
  clases: any[] = [];  // Propiedad para almacenar las clases

  constructor(private route: ActivatedRoute, private database: DatabaseService) {}

  ngOnInit() {
    const idMateriaStr = this.route.snapshot.paramMap.get('idMateria');
    if (idMateriaStr) {
      this.idMateria = Number(idMateriaStr);
      console.log('ID de la Materia:', this.idMateria);
      this.cargarClases();  
    } else {
      console.error('No se encontró el ID de la materia en la URL');
    }
  }

  // Método para cargar las clases de la materia
  cargarClases() {
    if (this.idMateria !== null) {
      this.database.getClasesByMateria(this.idMateria).subscribe(
        (data) => {
          this.clases = data;
          console.log('Clases cargadas:', this.clases);
        },
        (error) => {
          console.error('Error al cargar clases:', error);
        }
      );
    }
  }

  // Método para ver los detalles de una clase
  verClase(idClase: number) {
    console.log('Ver detalles de la clase con ID:', idClase);
    // Lógica para ver los detalles de la clase
    // Aquí podrías navegar a otra página o mostrar un modal, etc.
  }

  // Método para ver los alumnos presentes en una clase
  verAlumnosPresentes(idClase: number) {
    console.log('Ver alumnos presentes en la clase con ID:', idClase);
    // Lógica para ver los alumnos presentes
  }

  // Método para crear una nueva clase
  crearClase() {
    console.log('Crear nueva clase para la materia con ID:', this.idMateria);
    // Lógica para crear una nueva clase
    // Aquí podrías navegar a una página de creación de clase
  }
}
