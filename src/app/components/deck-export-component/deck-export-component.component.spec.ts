import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeckExportComponentComponent } from './deck-export-component.component';

describe('DeckExportComponentComponent', () => {
  let component: DeckExportComponentComponent;
  let fixture: ComponentFixture<DeckExportComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DeckExportComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckExportComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
