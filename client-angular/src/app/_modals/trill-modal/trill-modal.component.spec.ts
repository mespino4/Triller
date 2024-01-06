import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrillModalComponent } from './trill-modal.component';

describe('TrillModalComponent', () => {
  let component: TrillModalComponent;
  let fixture: ComponentFixture<TrillModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrillModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
