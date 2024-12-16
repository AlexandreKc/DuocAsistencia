import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';  // Asegúrate de importar HttpClientModule
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Importar el módulo HttpClientModule aquí
    });
    service = TestBed.inject(DatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
