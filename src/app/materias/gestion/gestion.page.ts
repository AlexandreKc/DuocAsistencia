import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadMaterias();
  }

  loadMaterias() {
    this.database.getAllMaterias().subscribe(
      (data) => {
        this.materias = data; 
        this.materiasFiltradas = [...this.materias]; 
      },
      (error) => {
        console.error('Error al cargar materias:', error);
      }
    );
  }

  filtrarMaterias(event: any) {
    const textoBusqueda = event.target.value.toLowerCase(); 
    if (textoBusqueda.trim() === '') {
      this.materiasFiltradas = this.materias;
    } else {
      this.materiasFiltradas = this.materias.filter((materia) =>
        materia.nombre.toLowerCase().includes(textoBusqueda)
      );
    }
  }

  // Método para crear una clase
  crearClase(idMateria: string) {
    this.database.crearClase(idMateria).subscribe(
      async (response) => {
        const { message, nombreClase } = response;
        console.log('Clase creada:', nombreClase);
  
        this.materiasFiltradas.push({
          nombre: nombreClase,
          descripcion: 'Descripción de la clase',
        });
  
        // Toast de exito
        const toast = await this.toastController.create({
          message: message,
          duration: 2000, 
          color: 'success', 
          position: 'bottom', 
        });
        toast.present();
      },
      async (error) => {
        console.error('Error al crear la clase:', error);
        
        // Toast de error
        const toast = await this.toastController.create({
          message: 'Hubo un error al crear la clase',
          duration: 2000,
          color: 'danger', 
          position: 'bottom', 
        });
        toast.present();
      }
    );
  }
  
  // Método que se ejecuta cuando se presiona "Ver Clases"
  verClases(idMateria: number) {
    console.log('Ver clases de la materia con ID:', idMateria);
    this.router.navigate([`/clases/${idMateria}`]); 
  }
}
