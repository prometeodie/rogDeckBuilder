import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeckViewerComponent } from './deck-viewer.component';

describe('DeckViewerComponent', () => {
  let component: DeckViewerComponent;
  let fixture: ComponentFixture<DeckViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DeckViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
