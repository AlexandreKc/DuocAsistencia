import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular/standalone';
import { UserdataService } from './servicio/user/userdata.service';
import { MenuserviceService } from './servicio/menu/menuservice.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicSharedModule } from './shared.module';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonApp, 
    IonRouterOutlet, 
    IonMenu, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonIcon, 
    IonLabel,
    RouterLink,
    IonicSharedModule,
    RouterOutlet
  ],
})
export class AppComponent  {
  //implements AfterViewInit
  isAdmin: boolean = false;
  showMenu: boolean = false;
  menuItems: any[] = [];

  constructor(
    private menuService: MenuserviceService,
    private userService: UserdataService,
    private platform: Platform,
    private menuController: MenuController,  
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.userService.loadUserData();
      this.userService.isUserLoggedIn().subscribe(loggedIn => {
        if (loggedIn) {
          this.checkAdminStatus();
        } else {
          this.menuController.enable(false);
          console.log('Menu disabled');
        }
      });
    });
  }

  checkAdminStatus() {
    const userData = this.userService.getUserData();
    if (userData) {
      this.isAdmin = userData.id_tp_usuario === 2;
      this.menuController.enable(true);
      console.log('Menu enabled');
    }
  }

  NgAfterViewInit() {
   this.menuController.enable(this.showMenu);
   }

  openMenu() {
    this.menuController.open();  
  }

  logout() {
    this.userService.clearUserData();
    localStorage.removeItem('userData');
    this.menuController.enable(false);
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}