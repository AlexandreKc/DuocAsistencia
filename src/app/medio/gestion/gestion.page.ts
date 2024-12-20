import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicSharedModule } from 'src/app/shared.module';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicSharedModule]
})
export class GestionPage implements OnInit {
  materias: any[] = []; 
  materiasFiltradas: any[] = []; 
  clases: any[] = []; 
  materiaAbierta: string | null = null;  
  
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

      // Mostrar la notificación de éxito con Capacitor Toast
      await Toast.show({
        text: message,
        duration: 'short', // 'short' (2-3 segundos) o 'long' (aprox. 5 segundos)
        position: 'bottom', // Opciones: 'top', 'center', 'bottom'
      });

      if (this.materiaAbierta === idMateria) {
        this.verClases(idMateria);
      } else {
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
      }
    },
    async (error) => {
      console.error('Error al crear la clase:', error);

      // Mostrar la notificación de error con Capacitor Toast
      await Toast.show({
        text: 'Hubo un error al crear la clase',
        duration: 'short',
        position: 'bottom',
      });
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
  console.log('Objeto Clase:', clase);

  if (clase?.id_clase && clase?.id_materia) {
    this.router.navigate(['/detalle'], {
      queryParams: {
        idMateria: clase.id_materia,
        idClase: clase.id_clase,
      },
    });
  } else {
    console.error('Faltan datos en el objeto clase');
  }
}
}