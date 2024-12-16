import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DetallePage } from './detalle.page';
import { DatabaseService } from 'src/app/servicio/database/database.service';

describe('DetallePage', () => {
  let component: DetallePage;
  let fixture: ComponentFixture<DetallePage>;
  let mockDatabaseService: jasmine.SpyObj<DatabaseService>;

  beforeEach(() => {
    // Mockear DatabaseService correctamente con el método getAlumnosPorClase
    mockDatabaseService = jasmine.createSpyObj('DatabaseService', ['getAlumnosPorClase']);

    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Asegúrate de importar HttpClientModule
      providers: [
        {
          provide: DatabaseService, // Proveer el servicio DatabaseService mockeado
          useValue: mockDatabaseService
        },
        {
          provide: ActivatedRoute, // Mock de ActivatedRoute
          useValue: {
            queryParams: of({ idMateria: 'mockIdMateria', idClase: '1' }) // Cambiar idClase a '1' que es un número válido
          }
        }
      ]
    });

    fixture = TestBed.createComponent(DetallePage);
    component = fixture.componentInstance;

    // Configura el comportamiento de getAlumnosPorClase para que devuelva un Observable mockeado
    mockDatabaseService.getAlumnosPorClase.and.returnValue(of({ alumnos: [{ id: 1, name: 'John Doe' }] }));

    fixture.detectChanges();  // Esto asegura que se ejecute el ciclo de vida de Angular
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick(); // Avanza el reloj para permitir que se resuelvan los Observables
    flush(); // Asegura que todos los temporizadores pendientes se completen
    expect(component).toBeTruthy();
  }));

  it('should call getAlumnosPorClase and load students', fakeAsync(() => {
    component.ngOnInit(); // Llama al ngOnInit para simular la inicialización del componente
    tick(); // Avanza el reloj para permitir que se resuelvan los Observables
    flush(); // Asegura que todos los temporizadores pendientes se completen

    // Verifica que el método getAlumnosPorClase del servicio fue llamado con el valor numérico 1
    expect(mockDatabaseService.getAlumnosPorClase).toHaveBeenCalledWith(1); // El valor esperado ahora es 1

    // Verifica que los alumnos se cargaron correctamente en el arreglo
    expect(component.alumnos.length).toBe(1); // Esperamos que haya un solo alumno
    expect(component.alumnos[0].name).toBe('John Doe');
  }));
});
