import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database/database.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
})
export class GestionPage implements OnInit {
  materias: any[] = []; // Lista de materias
  materiasFiltradas: any[] = []; // Lista de materias filtradas

  constructor(
    private database: DatabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadMaterias();
  }

  loadMaterias() {
    this.database.getAllMaterias().subscribe(
      (data) => {
        this.materias = data; // Guardar todas las materias
        this.materiasFiltradas = [...this.materias]; // Inicializar las materias filtradas con todas las materias
      },
      (error) => {
        console.error('Error al cargar materias:', error);
      }
    );
  }

  filtrarMaterias(event: any) {
    const textoBusqueda = event.target.value.toLowerCase(); // Obtener el texto del input
    if (textoBusqueda.trim() === '') {
      this.materiasFiltradas = this.materias;
    } else {
      this.materiasFiltradas = this.materias.filter((materia) =>
        materia.nombre.toLowerCase().includes(textoBusqueda)
      );
    }
  }

  // Método que se ejecuta cuando se presiona "Crear Clase"
  crearClase(idMateria: number) {
    console.log('Crear clase para la materia con ID:', idMateria);
    this.router.navigate(['/crear-clase', idMateria]);
  }

  // Método que se ejecuta cuando se presiona "Ver Clases"
  verClases(idMateria: number) {
    console.log('Ver clases de la materia con ID:', idMateria);
    this.router.navigate([`/clases/${idMateria}`]); 
  }
}
