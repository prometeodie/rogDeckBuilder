import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeckColorComponent } from './deck-color.component';

describe('DeckColorComponent', () => {
  let component: DeckColorComponent;
  let fixture: ComponentFixture<DeckColorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DeckColorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
