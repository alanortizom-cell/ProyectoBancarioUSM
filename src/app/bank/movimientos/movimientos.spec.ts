import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosComponent } from './movimientos';

describe('Movimientos', () => {
  let component: MovimientosComponent;
  let fixture: ComponentFixture<MovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
