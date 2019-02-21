import { TestBed } from '@angular/core/testing';

import { WordpressRestapiService } from './wordpress-restapi.service';

describe('WordpressRestapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WordpressRestapiService = TestBed.get(WordpressRestapiService);
    expect(service).toBeTruthy();
  });
});
