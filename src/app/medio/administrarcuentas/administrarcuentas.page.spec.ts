import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrarcuentasPage } from './administrarcuentas.page';

describe('AdministrarcuentasPage', () => {
  let component: AdministrarcuentasPage;
  let fixture: ComponentFixture<AdministrarcuentasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarcuentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
