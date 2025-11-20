import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeckbuilderPage } from './deckbuilder.page';

describe('DeckbuilderPage', () => {
  let component: DeckbuilderPage;
  let fixture: ComponentFixture<DeckbuilderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DeckbuilderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
