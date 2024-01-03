import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRolesModalComponent } from './edit-roles-modal.component';

describe('EditRolesModalComponent', () => {
  let component: EditRolesModalComponent;
  let fixture: ComponentFixture<EditRolesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRolesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRolesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
