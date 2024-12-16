import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { AdministrarcuentasPage } from './administrarcuentas.page';

describe('AdministrarcuentasPage', () => {
  let component: AdministrarcuentasPage;
  let fixture: ComponentFixture<AdministrarcuentasPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule] // Asegúrate de incluir HttpClientModule aquí
    });

    fixture = TestBed.createComponent(AdministrarcuentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
