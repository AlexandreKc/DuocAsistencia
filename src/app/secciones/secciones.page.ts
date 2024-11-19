import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.page.html',
  styleUrls: ['./secciones.page.scss'],
})
export class SeccionesPage implements OnInit {
  isAdmin: boolean = false;  // Para verificar si el usuario es administrador
  username: string = "";  // Para mostrar el nombre del usuario
  id_user: number | null = null;  // Almacena el tipo de usuario

  constructor(private route: ActivatedRoute,
    private router: Router
  ) { }
  navigateToQrPage() {
    this.router.navigate(['/qr']); // Navega a la página de QR
  }

  ngOnInit() {
    // Obtener parámetros de consulta para determinar si es administrador
    this.route.queryParams.subscribe(params => {
      console.log('Parámetros de consulta recibidos:', params);
      if (params['username']) {
        this.username = params['username'];
        console.log('Usuario recuperado:', this.username);
      }
      if (params['id_Tp_Usuario']) {
        this.id_user = +params['id_Tp_Usuario'];  // Convertir a número
        // Establecer isAdmin dependiendo del valor de id_Tp_Usuario
        if (this.id_user === 2) {
          this.isAdmin = true;  // Usuario administrador
        } else {
          this.isAdmin = false; // Usuario común
        }
        console.log('Tipo de usuario:', this.id_user);
        console.log('Es administrador:', this.isAdmin);
      }
    });
  }
}
