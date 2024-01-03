import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrillComponent } from './trill.component';

describe('TrillComponent', () => {
  let component: TrillComponent;
  let fixture: ComponentFixture<TrillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
