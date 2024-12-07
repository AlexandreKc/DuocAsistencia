import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EstadosService } from '../estado.service';
import { AnimationController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { UserService } from '../user/datos.service';  
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  username: string = "";
  isAdmin: boolean = false;  // Inicializamos isAdmin en false
  id_user: number | null = null;  // Para almacenar el tipo de usuario
  correo: string = "";  // Para almacenar el correo del usuario
  contrasena: string = "" //almacenar la contraseña


  openMenu() {
    this.menuService.openMenu();  // Llama al servicio para abrir el menú
  }

  constructor(
    private estadoService: EstadosService,
    private router: Router,
    private route: ActivatedRoute,
    private animationCtrl: AnimationController,
    private cdr: ChangeDetectorRef,
    private menuController: MenuController,
    private menuService: MenuService,
    private userService: UserService  // Añadir UserService al constructor
  ) {}

  

  ngOnInit() {

    // Obtener los datos del usuario desde el UserService
    const userData = this.userService.getUserData();
    if (userData) {
      this.username = userData.nombre;
      this.id_user = userData.id_tp_usuario;
      this.correo = userData.correo;
      this.contrasena = userData.contrasena;

      // Verifica si el usuario es administrador
      this.isAdmin = this.id_user === 2; // Ejemplo: Asumimos que el tipo 2 es administrador
    } else {
      console.error('No se pudo recuperar la información del usuario');
    }
  }
  
  ngAfterViewInit() {
    // Forzar la detección de cambios para iniciarlo
    this.cdr.detectChanges();
    // Esto es para hacer que la animación espere para entrar
    setTimeout(() => this.animarTexto(), 30);
  }

  animarTexto() {
    const texto = document.querySelector('.texto-desvanecido');
    if (texto) {
      const animacion = this.animationCtrl.create()
        .addElement(texto)
        .duration(1500)
        .fromTo('opacity', '0', '1');
      animacion.play();
    } else {
      console.error('No se pudo encontrar un elemento con la clase .texto-desvanecido');
    }
  }

  ionViewWillEnter() {
    // console.log('La vista está a punto de ser mostrada en pantalla');
    this.menuController.enable(true, 'menuId');  // Activa el menú al entrar a la página
  }

  // ionViewDidEnter() {
  //   console.log('La vista ha cargado y es visible en la pantalla');
  // }

  // ionViewWillLeave() {
  //   console.log('La vista saldrá de la pantalla');
  //   this.menuController.enable(false, 'menuId');  // Desactiva el menú al salir de la página
  // }

  // ionViewDidLeave() {
  //   console.log('La vista se ha ido');
  // }

  // ngOnDestroy() {
  //   console.log('El componente está a punto de ser destruido');
  // }

}
