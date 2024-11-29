import { Component, AfterViewInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { MenuService } from '../app/menu.service';
import { UserService } from '../app/user/datos.service';
import { Platform } from '@ionic/angular';
import { LocalNotificationService } from './local-notification.service';

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
    private localNotificationService: LocalNotificationService
  ) {
    this.initializeApp();
    this.userService.isUserLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.checkAdminStatus();
      }
    });
  }

  initializeApp() {
    // Espera a que la plataforma esté lista antes de ejecutar otras acciones
    this.platform.ready().then(() => {
      // Llama a la función para verificar el estado del administrador
      this.checkAdminStatus(); 
    });
  }
  

  checkAdminStatus() {
    const userData = this.userService.getUserData();
    console.log('User Data:', userData);
    if (userData) {
      this.isAdmin = userData.id_tp_usuario === 2; 
      this.menuController.enable(true);
      console.log('Menu enabled');
    } else {
      this.menuController.enable(false);
      console.log('Menu disabled');
    }
  }

  ngAfterViewInit() {
    this.menuController.enable(this.showMenu);
  }

  openMenu() {
    this.menuController.open();  
  }
}
