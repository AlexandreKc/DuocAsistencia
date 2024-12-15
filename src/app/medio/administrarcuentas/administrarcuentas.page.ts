import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicSharedModule } from 'src/app/shared.module';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-administrarcuentas',
  templateUrl: './administrarcuentas.page.html',
  styleUrls: ['./administrarcuentas.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicSharedModule],
})
export class AdministrarcuentasPage implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  busqueda: string = '';
  mostrarModalEliminar: boolean = false; 
  materiasParaAsignar: any[] = [];
  materiasParaRemover: any[] = [];
  mostrarModalAsignar: boolean = false;
  mostrarModalRemover: boolean = false;
  usuarioSeleccionado: any = null;
  busquedaMateria: string = '';

  constructor(private databaseService: DatabaseService, private toastController: ToastController) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.databaseService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
      },
      error: (err) => console.error('Error al cargar usuarios:', err),
    });
  }

  filtrarUsuarios() {
    const busqueda = this.busqueda.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter((usuario) =>
      usuario.correo.toLowerCase().includes(busqueda)
    );
  }

  abrirModalAsignarMaterias(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.databaseService.getAllMaterias().subscribe({
      next: (data) => {
        this.materiasParaAsignar = data.map((materia) => ({
          ...materia,
          seleccionada: false,
        }));
        this.mostrarModalAsignar = true;
      },
      error: (err) => console.error('Error al cargar materias para asignar:', err),
    });
  }

  cerrarModalAsignar() {
    this.mostrarModalAsignar = false;
    this.usuarioSeleccionado = null;
  }

  abrirModalRemoverMaterias(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.databaseService.getMaterias(usuario.id).subscribe({
      next: (data) => {
        this.materiasParaRemover = data.map((materia) => ({
          ...materia,
          seleccionada: false,
        }));
        this.mostrarModalRemover = true;
      },
      error: (err) => console.error('Error al cargar materias asignadas:', err),
    });
  }

  cerrarModalRemover() {
    this.mostrarModalRemover = false;
    this.usuarioSeleccionado = null;
  }

  filtrarMateriasParaAsignar() {
    const busqueda = this.busquedaMateria.toLowerCase();
    this.materiasParaAsignar = this.materiasParaAsignar.filter((materia) =>
      materia.nombre.toLowerCase().includes(busqueda)
    );
  }

  filtrarMateriasParaRemover() {
    const busqueda = this.busquedaMateria.toLowerCase();
    this.materiasParaRemover = this.materiasParaRemover.filter((materia) =>
      materia.nombre.toLowerCase().includes(busqueda)
    );
  }

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }

  async asignarMateriasSeleccionadas() {
    const materiasSeleccionadas = this.materiasParaAsignar
      .filter((materia) => materia.seleccionada)
      .map((materia) => materia.id);

    if (!materiasSeleccionadas.length) {
      await this.mostrarToast('Debes seleccionar al menos una materia.', 'warning');
      return;
    }

    this.databaseService.asignarMaterias(this.usuarioSeleccionado.id, materiasSeleccionadas).subscribe({
      next: async () => {
        await this.mostrarToast('Materias asignadas correctamente.');
        this.cerrarModalAsignar();
      },
      error: async (err) => {
        console.error('Error al asignar materias:', err);
        await this.mostrarToast('Error al asignar materias.', 'danger');
      },
    });
  }

  async removerMateriasSeleccionadas() {
    // Depuración: Verificar el contenido de materiasParaRemover
    console.log('Contenido de materiasParaRemover:', this.materiasParaRemover);
  
    // Ajusta el atributo que contiene el ID de la materia
    const materiasSeleccionadas = this.materiasParaRemover
      .filter((materia) => materia.seleccionada)
      .map((materia) => materia.materia_id); // Cambia a materia.materia_id si es necesario
  
    // Depuración: Verificar las materias seleccionadas
    console.log('Materias seleccionadas para remover (IDs):', materiasSeleccionadas);
  
    if (!materiasSeleccionadas.length) {
      await this.mostrarToast('Debes seleccionar al menos una materia.', 'warning');
      return;
    }
  
    // Depuración: Verificar el payload antes de enviarlo
    const payload = {
      usuarioId: this.usuarioSeleccionado.id,
      materiasSeleccionadas,
    };
    console.log('Payload enviado al servicio:', payload);
  
    this.databaseService.removerMaterias(payload.usuarioId, payload.materiasSeleccionadas).subscribe({
      next: async (response) => {
        console.log('Respuesta del servidor al remover materias:', response); // Depuración
        await this.mostrarToast('Materias removidas correctamente.');
        this.cerrarModalRemover();
      },
      error: async (err) => {
        console.error('Error al remover materias:', err); // Depuración de errores
        await this.mostrarToast('Error al remover materias.', 'danger');
      },
    });
  }
  
  
  onCheckboxChangeAsignar(event: any, index: number) {
    this.materiasParaAsignar[index].seleccionada = event.detail.checked;
  }

  onCheckboxChangeRemover(event: any, index: number) {
    this.materiasParaRemover[index].seleccionada = event.detail.checked;
  }

  obtenerRol(idTpUsuario: number): string {
    switch (idTpUsuario) {
      case 1:
        return 'Alumno';
      case 2:
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }
  //para eliminacion de cuentas
  async eliminarCuentaUsuario() {
    if (!this.usuarioSeleccionado) {
      await this.mostrarToast('No se seleccionó un usuario.', 'warning');
      return;
    }

    this.databaseService.deleteUsuario(this.usuarioSeleccionado.id).subscribe({
      next: async () => {
        await this.mostrarToast('Cuenta eliminada correctamente.');
        this.cerrarModalEliminar();
        this.cargarUsuarios(); // Refresca la lista de usuarios
      },
      error: async (err) => {
        console.error('Error al eliminar cuenta:', err);
        await this.mostrarToast('Error al eliminar la cuenta.', 'danger');
      },
    });
  }

    abrirModalEliminarCuenta(usuario: any) {
      this.usuarioSeleccionado = usuario;
      this.mostrarModalEliminar = true;
    }

    cerrarModalEliminar() {
      this.mostrarModalEliminar = false;
      this.usuarioSeleccionado = null;
    }


}
