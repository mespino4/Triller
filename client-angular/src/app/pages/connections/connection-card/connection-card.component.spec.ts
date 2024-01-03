import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionCardComponent } from './connection-card.component';

describe('ConnectionCardComponent', () => {
  let component: ConnectionCardComponent;
  let fixture: ComponentFixture<ConnectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
