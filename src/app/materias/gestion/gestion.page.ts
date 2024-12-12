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
  materias: any[] = []; 
  materiasFiltradas: any[] = []; 
  clases: any[] = []; 
  materiaAbierta: string | null = null;  // Para rastrear qué materia tiene las clases visibles
  
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

crearClase(idMateria: string) {
  this.database.crearClase(idMateria).subscribe(
    async (response) => {
      const { message, nombreClase } = response;
      console.log('Clase creada:', nombreClase);
      
      const materia = this.materiasFiltradas.find((m) => m.id === idMateria);
      if (materia) {
        if (!materia.clases) {
          materia.clases = []; 
        }
        materia.clases.push({
          nombre: nombreClase,
          descripcion: '',
        });
      }
      
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

verClases(idMateria: string) {
  // Si la materia seleccionada es la misma que la abierta, cerramos su vista
  if (this.materiaAbierta === idMateria) {
    this.materiaAbierta = null; // Cerrar la materia
    return;
  }
  
  // Si es una materia diferente, cerramos la anterior y abrimos la nueva
  this.materiaAbierta = idMateria;
  
  this.database.verClases(idMateria).subscribe(
    (response) => {
      console.log('Respuesta completa:', response); // Log para ver la respuesta completa
      
      // Verifica si 'response' contiene el array de clases
      if (response && Array.isArray(response)) {
        const clases = response; // Si la respuesta es un array de clases, usémosla directamente
        
        // Buscar la materia y asignar las clases
        const materia = this.materiasFiltradas.find((m) => m.id === idMateria);
        if (materia) {
          materia.clases = clases; // Asigna las clases recibidas a la materia
          materia.verClases = true; // Cambia el estado de verClases
        }
      } else {
        console.error('No se encontraron clases en la respuesta');
      }
    },
    (error) => {
      console.error('Error al obtener las clases:', error);
    }
  );
}
// Método para navegar a la página de detalles y pasar el idMateria
verInformacionClase(clase: any) {
  console.log('Clase objeto:', clase); // Imprimir todo el objeto
  console.log('Clase ID:', clase?.id_clase);  // Verificar si la propiedad id_clase está presente
  console.log('Materia ID:', clase?.id_materia);  // Verificar si la propiedad id_materia está presente

  // Verifica si tanto id_clase como id_materia están definidos
  if (clase?.id_clase && clase?.id_materia) {
    // Enviar ambos ids como queryParams
    this.router.navigate(['/detalle'], {
      queryParams: {
        idMateria: clase.id_materia,
        idClase: clase.id_clase
      }
    });
  } else {
    console.error('El ID de la materia o el ID de la clase no está definido.');
  }
}
}
