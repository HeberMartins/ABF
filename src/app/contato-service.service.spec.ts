import { TestBed } from '@angular/core/testing';

import { ContatoServiceService } from './contato-service.service';

describe('ContatoServiceService', () => {
  let service: ContatoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContatoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
