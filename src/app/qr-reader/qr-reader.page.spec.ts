import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrReaderPage } from './qr-reader.page';

describe('QrReaderPage', () => {
  let component: QrReaderPage;
  let fixture: ComponentFixture<QrReaderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrReaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
