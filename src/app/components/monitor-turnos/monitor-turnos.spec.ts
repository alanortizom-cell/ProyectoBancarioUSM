import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorTurnos } from './monitor-turnos';

describe('MonitorTurnos', () => {
  let component: MonitorTurnos;
  let fixture: ComponentFixture<MonitorTurnos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitorTurnos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorTurnos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
