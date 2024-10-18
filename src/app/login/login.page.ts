import { ɵnormalizeQueryParams } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';  // Importa AlertController

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //Almacenar el nombre y el pass del user
  username: string = "";
  password: string = "";
  alertButtons = ['Action'];

  constructor(private router:Router, private alertController: AlertController ) { }//alerta en la pantalla al no completar los campos
  ngOnInit() {}

  // Método para mostrar la alerta
  async mostrarAlerta() {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Campos incompletos',
      message: 'Por favor, completa todos los campos correctamente.',
      buttons: ['OK']
    });

    await alert.present();
  }  

  login(){
      if(this.username.length>=3 && this.username.length<=12 && this.password.length===4){
        this.router.navigate(['/home'],{queryParams: {username:this.username}})
      }  else {
        this.mostrarAlerta();
      }
    }
  
}
