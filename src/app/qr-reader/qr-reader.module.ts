import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrReaderPageRoutingModule } from './qr-reader-routing.module';

import { QrReaderPage } from './qr-reader.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrReaderPageRoutingModule
  ],
  declarations: [QrReaderPage]
})
export class QrReaderPageModule {}
