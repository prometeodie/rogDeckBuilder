import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeckCardsComponent } from './deck-cards.component';

describe('DeckCardsComponent', () => {
  let component: DeckCardsComponent;
  let fixture: ComponentFixture<DeckCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DeckCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
