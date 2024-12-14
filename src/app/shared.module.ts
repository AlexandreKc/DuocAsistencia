import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonIcon, IonLabel, IonCard, IonCardContent, IonInput, IonButton ,
  IonText
} from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

@NgModule({
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
    IonCard,
    IonCardContent, // Añadido
    IonInput,       // Añadido
    IonButton,
    HttpClientModule,
    IonText
  ],
  exports: [
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
    IonCard,
    IonCardContent, 
    IonInput,       
    IonButton,
    HttpClientModule,
    IonText
  ]
})
export class IonicSharedModule {
  constructor() {
    addIcons(allIcons);
  }
}
