import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EstadosService } from '../estado.service';
import { AnimationController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  contador: number = 0;
  username: string = "";
  isAdmin: boolean = false;  // Inicializamos isAdmin en false
  id_user: number | null = null;  // Para almacenar el tipo de usuario

  constructor(
    private estadoService: EstadosService,
    private router: Router,
    private route: ActivatedRoute,
    private animationCtrl: AnimationController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('Contador se encuentra inicializado');
    this.estadoService.contadorActual.subscribe(valor => {
      this.contador = valor;
      console.log('ngOnInit - Contador está actualizado', this.contador);
    });
  
    this.route.queryParams.subscribe(params => {
      console.log('Parámetros de consulta recibidos:', params);
      if (params['username']) {
        this.username = params['username'];
        console.log('ngOnInit - Usuario recuperado', this.username);
      }
      if (params['id_Tp_Usuario']) {
        this.id_user = +params['id_Tp_Usuario'];  // Convertimos a número
        // Establecer isAdmin dependiendo del valor de id_Tp_Usuario
        if (this.id_user === 2) {
          this.isAdmin = true;  // Es administrador
        } else {
          this.isAdmin = false; // Es usuario común
        }
        console.log('ngOnInit - Tipo de usuario:', this.id_user);
        console.log('ngOnInit - Es administrador:', this.isAdmin);
      }
    });
  }
  
  
  
  

  ngAfterViewInit() {
    // Forzar la detección de cambios para iniciarlo
    this.cdr.detectChanges();
    //esto es para hacer que la animación espere para entrar
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
    console.log('La vista está a punto de ser mostrada en pantalla');
    this.incrementarContador();
    console.log('ionViewWillEnter - Contador actualizado a', this.contador);
  }

  ionViewDidEnter() {
    console.log('La vista ha cargado y es visible en la pantalla');
    console.log('ionViewDidEnter - Contador actualizado a', this.contador);
  }

  ionViewWillLeave() {
    console.log('La vista saldrá de la pantalla');
    this.decrementarContador();
    console.log('ionViewWillLeave - Contador actualizado a', this.contador);
  }

  ionViewDidLeave() {
    console.log('La vista se ha ido');
    console.log('ionViewDidLeave - Contador actualizado a', this.contador);
  }

  ngOnDestroy() {
    console.log('El componente está a punto de ser destruido');
    this.incrementarContador();
    console.log('ngOnDestroy - Contador actualizado a', this.contador);
  }

  incrementarContador() {
    this.estadoService.incrementar();
    // Espera un breve momento hacer el log
    setTimeout(() => {
      console.log('Contador después de incrementar:', this.contador);
    }, 0);
  }

  decrementarContador() {
    this.estadoService.decrementar();
    // Espera un breve momento antes de hacer el log
    setTimeout(() => {
      console.log('Contador después de decrementar:', this.contador);
    }, 0);
  }
}
