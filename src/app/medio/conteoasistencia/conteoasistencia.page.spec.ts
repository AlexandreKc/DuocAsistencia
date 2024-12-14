import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConteoasistenciaPage } from './conteoasistencia.page';

describe('ConteoasistenciaPage', () => {
  let component: ConteoasistenciaPage;
  let fixture: ComponentFixture<ConteoasistenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConteoasistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
