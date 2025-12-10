import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstadisticsComponent } from './estadistics.component';

describe('EstadisticsComponent', () => {
  let component: EstadisticsComponent;
  let fixture: ComponentFixture<EstadisticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EstadisticsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
