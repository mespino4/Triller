import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreUsersModalComponent } from './explore-users-modal.component';

describe('ExploreUsersModalComponent', () => {
  let component: ExploreUsersModalComponent;
  let fixture: ComponentFixture<ExploreUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreUsersModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
