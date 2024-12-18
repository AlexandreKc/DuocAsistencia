import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/servicio/database/database.service';
import { ToastController, ModalController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-administrarcuentas',
  templateUrl: './administrarcuentas.page.html',
  styleUrls: ['./administrarcuentas.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
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

  constructor(
    private databaseService: DatabaseService,
    private toastController: ToastController,
    private modalController: ModalController,
    private router: Router
  ) {}

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

  async cerrarModalAsignar() {
    this.mostrarModalAsignar = false;
    this.usuarioSeleccionado = null;

    // Si el modal no se cierra correctamente, forzar el cierre con ModalController
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss();
    }
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

  async cerrarModalRemover() {
    this.mostrarModalRemover = false;
    this.usuarioSeleccionado = null;

    // Si el modal no se cierra correctamente, forzar el cierre con ModalController
    const modal = await this.modalController.getTop();
    if (modal) {
      await modal.dismiss();
    }
  }

  abrirModalEliminarCuenta(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.mostrarModalEliminar = true;
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
      await Toast.show({
        text: 'Debes seleccionar al menos una materia.',
        duration: 'short',
        position: 'bottom',
      });
      return;
    }

    this.databaseService.asignarMaterias(this.usuarioSeleccionado.id, materiasSeleccionadas).subscribe({
      next: async () => {
        await Toast.show({
          text: 'Materias asignadas correctamente.',
          duration: 'short',
          position: 'bottom',
        });
        this.cerrarModalAsignar();
      },
      error: async (err) => {
        console.error('Error al asignar materias:', err);
        await Toast.show({
          text: 'Error al asignar materias.',
          duration: 'short',
          position: 'bottom',
        });
      },
    });
  }

  async removerMateriasSeleccionadas() {
    const materiasSeleccionadas = this.materiasParaRemover
      .filter((materia) => materia.seleccionada)
      .map((materia) => materia.materia_id);

    if (!materiasSeleccionadas.length) {
      await Toast.show({
        text: 'Debes seleccionar al menos una materia.',
        duration: 'short',
        position: 'bottom',
      });
      return;
    }

    const payload = {
      usuarioId: this.usuarioSeleccionado.id,
      materiasSeleccionadas,
    };

    this.databaseService.removerMaterias(payload.usuarioId, payload.materiasSeleccionadas).subscribe({
      next: async () => {
        await Toast.show({
          text: 'Materias removidas correctamente.',
          duration: 'short',
          position: 'bottom',
        });
        this.cerrarModalRemover();
      },
      error: async (err) => {
        console.error('Error al remover materias:', err);
        await Toast.show({
          text: 'Error al remover materias.',
          duration: 'short',
          position: 'bottom',
        });
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
  async abrirModalEliminar(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.mostrarModalEliminar = true;
  }
  
  async cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.usuarioSeleccionado = null;
  }
  
  async eliminarCuentaUsuario() {
    if (!this.usuarioSeleccionado) {
      await Toast.show({
        text: 'No se seleccionó un usuario.',
        duration: 'short',
        position: 'bottom',
      });
      return;
    }
  
    this.databaseService.deleteUsuario(this.usuarioSeleccionado.id).subscribe({
      next: async () => {
        // Muestra un toast de éxito
        await Toast.show({
          text: 'Usuario eliminado con éxito.',
          duration: 'short',
          position: 'bottom',
        });
  
        // Cierra el modal y recarga usuarios
        this.cerrarModalEliminar();
        this.cargarUsuarios();
      },
      error: async (err) => {
        console.error('Error al eliminar cuenta:', err);
  
        // Muestra un toast de error
        await Toast.show({
          text: 'Error al eliminar la cuenta.',
          duration: 'short',
          position: 'bottom',
        });
      },
    });
  }
  
  
}
