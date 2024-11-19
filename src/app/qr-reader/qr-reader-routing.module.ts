import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrReaderPage } from './qr-reader.page';

const routes: Routes = [
  {
    path: '',
    component: QrReaderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrReaderPageRoutingModule {}
