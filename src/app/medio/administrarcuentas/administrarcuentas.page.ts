import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicSharedModule } from 'src/app/shared.module';
import { DatabaseService } from 'src/app/servicio/database/database.service';

@Component({
  selector: 'app-administrarcuentas',
  templateUrl: './administrarcuentas.page.html',
  styleUrls: ['./administrarcuentas.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicSharedModule]
})
export class AdministrarcuentasPage implements OnInit {
  usuarios: any[] = []; 
  usuariosFiltrados: any[] = []; 
  busqueda: string = '';

  // Variables para asignar materias
  mostrarModal: boolean = false;
  usuarioSeleccionado: any = null;
  materiasDisponibles: any[] = [];

  constructor(private databaseService: DatabaseService) {}
  materiasFiltradas: any[] = []; 
  busquedaMateria: string = ''; 
  ngOnInit() {
    this.cargarUsuarios();
    this.cargarMaterias(); // Cargar las materias disponibles al iniciar
  }

  cargarUsuarios() {
    this.databaseService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data; 
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      },
    });
  }

  filtrarUsuarios() {
    if (this.busqueda.trim() === '') {
      this.usuariosFiltrados = this.usuarios;
    } else {
      this.usuariosFiltrados = this.usuarios.filter((usuario) =>
        usuario.correo.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
  }

  eliminarUsuario(id: number) {
    console.log('Intentando eliminar usuario con ID:', id);
  
    if (confirm('¿Estás seguro de que deseas eliminar este usuario y todas sus relaciones?')) {
      this.databaseService.deleteUsuario(id).subscribe({
        next: () => {
          console.log(`Usuario con ID ${id} eliminado junto con sus relaciones.`);
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
        },
      });
    } else {
      console.log('Eliminación cancelada por el usuario.');
    }
  }

  obtenerRol(idTpUsuario: number): string {
    switch (idTpUsuario) {
      case 1:
        return 'Estudiante';
      case 2:
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }


  cargarMaterias() {
    this.databaseService.getAllMaterias().subscribe({
      next: (data) => {
        this.materiasDisponibles = data.map((materia) => ({
          ...materia,
          seleccionada: false, // Inicializa el estado de selección
        }));
        this.materiasFiltradas = [...this.materiasDisponibles]; // Inicializa la lista filtrada
      },
      error: (err) => console.error('Error al cargar materias:', err),
    });
  }
  filtrarMaterias() {
    const busqueda = this.busquedaMateria.toLowerCase();
    this.materiasFiltradas = this.materiasDisponibles.filter((materia) =>
      materia.nombre.toLowerCase().includes(busqueda)
    );
  }


  // Método para abrir el modal y asignar materias
  abrirModalAsignarMaterias(usuario: any) {
    this.usuarioSeleccionado = usuario;
    // Reiniciar las selecciones
    this.materiasDisponibles.forEach(m => m.seleccionada = false);
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }

  asignarMateriasSeleccionadas() {
    if (!this.usuarioSeleccionado) return;

    const materiasAAsignar = this.materiasDisponibles
      .filter(m => m.seleccionada)
      .map(m => m.id); // Suponiendo que la materia tiene un campo "id"

    if (materiasAAsignar.length === 0) {
      alert('Debes seleccionar al menos una materia.');
      return;
    }

    this.databaseService.asignarMaterias(this.usuarioSeleccionado.id, materiasAAsignar).subscribe({
      next: (response) => {
        console.log('Materias asignadas con éxito:', response);
        alert('Materias asignadas correctamente.');
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al asignar materias:', err);
        alert('Hubo un error al asignar las materias.');
      }
    });
  }
  onCheckboxChange(event: any, index: number) {
    this.materiasDisponibles[index].seleccionada = event.detail.checked;
  }
}
