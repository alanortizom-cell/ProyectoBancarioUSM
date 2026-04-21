import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionCajero } from './gestion-cajero';

describe('GestionCajero', () => {
  let component: GestionCajero;
  let fixture: ComponentFixture<GestionCajero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionCajero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionCajero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
