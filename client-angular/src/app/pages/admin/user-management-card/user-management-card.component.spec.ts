import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementCardComponent } from './user-management-card.component';

describe('UserManagementCardComponent', () => {
  let component: UserManagementCardComponent;
  let fixture: ComponentFixture<UserManagementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserManagementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
