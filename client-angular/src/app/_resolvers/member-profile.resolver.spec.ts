import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { memberProfileResolver } from './member-profile.resolver';

describe('memberProfileResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => memberProfileResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
