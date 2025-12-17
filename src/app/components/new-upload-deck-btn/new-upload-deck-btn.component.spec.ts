import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewUploadDeckBtnComponent } from './new-upload-deck-btn.component';

describe('NewUploadDeckBtnComponent', () => {
  let component: NewUploadDeckBtnComponent;
  let fixture: ComponentFixture<NewUploadDeckBtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NewUploadDeckBtnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewUploadDeckBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
