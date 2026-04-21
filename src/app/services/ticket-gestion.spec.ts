import { TestBed } from '@angular/core/testing';

import { TicketGestion } from './ticket-gestion';

describe('TicketGestion', () => {
  let service: TicketGestion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketGestion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
