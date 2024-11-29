import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Para formularios basados en plantillas
// import { ReactiveFormsModule } from '@angular/forms'; // Si usas formularios reactivos
import { CambiarContrasenaPage } from './cambiar-contrasena.page';

describe('CambiarContrasenaPage', () => {
  let component: CambiarContrasenaPage;
  let fixture: ComponentFixture<CambiarContrasenaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarContrasenaPage], // Declarar el componente
      imports: [
        HttpClientTestingModule,
        FormsModule, // Agrega FormsModule o ReactiveFormsModule según el caso
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarContrasenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
