import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage  {

  newpassword: string = '';
  confirmpassword: string = '';

  constructor(private router: Router) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Este sirve por si el formulario es válido, te llevará al login
      this.router.navigate(['/login']);
    } else {
      // Esto aparecera si el formulario no es válido.
      console.log('Formulario inválido');
    }
  }

  

}
