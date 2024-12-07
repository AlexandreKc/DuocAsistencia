import { Component, AfterViewInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { MenuService } from '../app/menu.service';
import { UserService } from '../app/user/datos.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  isAdmin: boolean = false;
  showMenu: boolean = false;

  constructor(
    private menuService: MenuService,
    private userService: UserService,
    private platform: Platform,
    private menuController: MenuController,  
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.initializeApp();
  }
  
  initializeApp() {
    // Espera a que la plataforma esté lista antes de ejecutar otras acciones
    this.platform.ready().then(() => {
      // Cargar los datos del usuario desde el servicio
      this.userService.loadUserData();
      this.userService.isUserLoggedIn().subscribe(loggedIn => {
        if (loggedIn) {
          // Si el usuario está logueado, verifica su estado de admin
          this.checkAdminStatus();
        } else {
          // Si no está logueado, asegúrate de deshabilitar el menú
          this.menuController.enable(false);
          console.log('Menu disabled');
        }
      });
    });
  }
  
  checkAdminStatus() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.isAdmin = userData.id_tp_usuario === 2; // Verificar si es admin
      this.menuController.enable(true);  // Habilitar el menú
      console.log('Menu enabled');
    }
  }

  ngAfterViewInit() {
    this.menuController.enable(this.showMenu);
  }

  openMenu() {
    this.menuController.open();  
  }

  logout() {
    // Limpiar los datos del usuario en el UserService
    this.userService.clearUserData();

    // Limpiar el localStorage
    localStorage.removeItem('userData');

    // Deshabilitar el menú si no hay sesión
    this.menuController.enable(false);

    // Redirigir al login
    this.router.navigate(['/login']).then(() => {
      // Después de redirigir, forzamos un reinicio de la página
      window.location.reload(); // Recarga la página
    });
  }
}
