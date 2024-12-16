import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { EscanearPage } from './escanear.page';

describe('EscanearPage', () => {
  let component: EscanearPage;
  let fixture: ComponentFixture<EscanearPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EscanearPage], // Importa HttpClientTestingModule y EscanearPage
    });

    fixture = TestBed.createComponent(EscanearPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
