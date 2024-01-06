import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageChangeModalComponent } from './language-change-modal.component';

describe('LanguageChangeModalComponent', () => {
  let component: LanguageChangeModalComponent;
  let fixture: ComponentFixture<LanguageChangeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageChangeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LanguageChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
