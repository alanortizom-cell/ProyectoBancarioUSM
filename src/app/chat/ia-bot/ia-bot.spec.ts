import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaBot } from './ia-bot';

describe('IaBot', () => {
  let component: IaBot;
  let fixture: ComponentFixture<IaBot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IaBot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IaBot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
