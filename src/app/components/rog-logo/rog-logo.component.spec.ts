import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RogLogoComponent } from './rog-logo.component';

describe('RogLogoComponent', () => {
  let component: RogLogoComponent;
  let fixture: ComponentFixture<RogLogoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RogLogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RogLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
