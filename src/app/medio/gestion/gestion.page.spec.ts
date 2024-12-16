import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GestionPage } from './gestion.page'; // Standalone component

describe('GestionPage', () => {
  let component: GestionPage;
  let fixture: ComponentFixture<GestionPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        GestionPage, // Importa el componente standalone aquí
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
            paramMap: of({ get: () => null }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(GestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
