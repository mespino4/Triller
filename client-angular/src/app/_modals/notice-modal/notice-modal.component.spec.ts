import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeModalComponent } from './notice-modal.component';

describe('NoticeModalComponent', () => {
  let component: NoticeModalComponent;
  let fixture: ComponentFixture<NoticeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoticeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
