import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuEnabled: boolean = true; // Controla si el menú está habilitado

  constructor(private menuController: MenuController) {}

  // Método para habilitar o deshabilitar el menú
  setMenuEnabled(enabled: boolean) {
    this.menuEnabled = enabled;
    this.menuController.enable(enabled); // Habilita o deshabilita el menú en función del estado
  }

  // Método para abrir el menú
  openMenu() {
    if (this.menuEnabled) {
      this.menuController.open(); // Abre el menú si está habilitado
    }
  }

  // Método para verificar si el menú está habilitado
  isMenuEnabled(): boolean {
    return this.menuEnabled;
  }
}
