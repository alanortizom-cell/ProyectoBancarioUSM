import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioTicket } from './usuario-ticket';

describe('UsuarioTicket', () => {
  let component: UsuarioTicket;
  let fixture: ComponentFixture<UsuarioTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioTicket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
