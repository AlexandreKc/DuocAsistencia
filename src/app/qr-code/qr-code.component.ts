import { Component } from '@angular/core';
import { QrCodeService } from '../qr-code.service';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss'],
})
export class QrCodeComponent {
  qrCodeUrl: string = '';

  constructor(private qrCodeService: QrCodeService) {}

  generateQrCode() {
    const data = 'https://example.com'; // Reemplaza con la información que desees
    this.qrCodeUrl = this.qrCodeService.generateQrCode(data, '300x300');
  }
}
