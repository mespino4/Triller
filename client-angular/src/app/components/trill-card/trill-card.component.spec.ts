import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrillCardComponent } from './trill-card.component';

describe('TrillCardComponent', () => {
  let component: TrillCardComponent;
  let fixture: ComponentFixture<TrillCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrillCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrillCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
