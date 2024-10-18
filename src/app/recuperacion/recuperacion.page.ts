import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  username: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

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
