import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // se agregó la importación

@Injectable({
  providedIn: 'root'
})
export class EstadoserviceService {
  //inicializando contador en 0 y que cualquier cambio que sufra se vaya actualizando
  private contador = new BehaviorSubject <number>(0);

  //contador sea observable y va a permitir que se suscriba a la variable 
  contadorActual = this.contador.asObservable();
  constructor() { }

  //Método incrementar el valor del contador
  incrementar(){
    this.contador.next(this.contador.value + 1);
  }

  //Método decrementar el valor del contador
  decrementar(){
    this.contador.next(this.contador.value - 1);
  }
  //Método para inicializar el valor del contador en 0
  inicializar(){
    this.contador.next(0);
  }
}
