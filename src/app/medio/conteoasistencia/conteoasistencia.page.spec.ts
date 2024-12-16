import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de pruebas de HttpClient
import { ConteoasistenciaPage } from './conteoasistencia.page';

describe('ConteoasistenciaPage', () => {
  let component: ConteoasistenciaPage;
  let fixture: ComponentFixture<ConteoasistenciaPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Agrega HttpClientTestingModule aquí
    });
    fixture = TestBed.createComponent(ConteoasistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
