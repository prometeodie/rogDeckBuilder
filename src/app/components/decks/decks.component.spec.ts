import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DecksComponent } from './decks.component';

describe('DecksComponent', () => {
  let component: DecksComponent;
  let fixture: ComponentFixture<DecksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DecksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
