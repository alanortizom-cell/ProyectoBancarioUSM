import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cajeros } from './cajeros';

describe('Cajeros', () => {
  let component: Cajeros;
  let fixture: ComponentFixture<Cajeros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cajeros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cajeros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
