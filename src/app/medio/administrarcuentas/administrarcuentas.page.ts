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
  usuarios: any[] = []; // Aquí se almacenan los usuarios

  constructor(private databaseService: DatabaseService) {}
  busqueda: string = '';
  usuariosFiltrados: any[] = []; 
    ngOnInit() {
    this.cargarUsuarios();
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
      // Si no hay búsqueda, mostrar todos los usuarios
      this.usuariosFiltrados = this.usuarios;
    } else {
      // Filtrar usuarios por correo
      this.usuariosFiltrados = this.usuarios.filter((usuario) =>
        usuario.correo.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
  }
}

