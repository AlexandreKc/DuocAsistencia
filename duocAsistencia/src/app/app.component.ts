import { Component, AfterViewInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(
    private animationCtrl: AnimationController,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Forzar la detección de cambios para asegurar que el DOM esté actualizado
    this.cdr.detectChanges();
    setTimeout(() => this.animarTexto(), 60);
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
}
