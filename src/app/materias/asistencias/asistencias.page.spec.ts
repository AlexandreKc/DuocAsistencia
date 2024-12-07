import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsistenciasPage } from './asistencias.page';

describe('AsistenciasPage', () => {
  let component: AsistenciasPage;
  let fixture: ComponentFixture<AsistenciasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
