import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlockedUsersComponent } from './view-blocked-users.component';

describe('ViewBlockedUsersComponent', () => {
  let component: ViewBlockedUsersComponent;
  let fixture: ComponentFixture<ViewBlockedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBlockedUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBlockedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
