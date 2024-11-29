import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { RecuperacionPage } from './recuperacion.page';

describe('RecuperacionPage', () => {
  let component: RecuperacionPage;
  let fixture: ComponentFixture<RecuperacionPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecuperacionPage], // Declara el componente
      imports: [
        HttpClientTestingModule, // Importa HttpClientTestingModule
        FormsModule, // Importa FormsModule para habilitar NgForm
      ],
    });
    fixture = TestBed.createComponent(RecuperacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
