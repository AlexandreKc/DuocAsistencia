import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/database/database.service';
import { UserService } from '../../user/datos.service';

@Component({
  selector: 'app-asistencias',
  templateUrl: './asistencias.page.html',
  styleUrls: ['./asistencias.page.scss'],
})
export class AsistenciasPage implements OnInit {

  materias: any[] = [];  // Lista de materias
  usuarioId: number | null = null;  // ID del usuario logueado

  constructor(
    private databaseService: DatabaseService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Suscribirse al estado de inicio de sesión
    this.userService.isUserLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        // Obtener el ID del usuario desde el servicio UserService
        this.usuarioId = this.userService.getUserId();

        // Verificar que usuarioId no sea null antes de hacer la consulta
        if (this.usuarioId) {
          // Llamar al servicio para obtener las materias
          this.databaseService.getMaterias(this.usuarioId).subscribe(
            (data) => {
              this.materias = data;  // Asignar las materias obtenidas
            },
            (error) => {
              console.error('Error al obtener las materias:', error);
            }
          );
        } else {
          console.error('ID de usuario no disponible');
        }
      } else {
        // Si no está logueado, redirigir al login o mostrar un mensaje
        console.log('Usuario no logueado');
      }
    });
  }
}
