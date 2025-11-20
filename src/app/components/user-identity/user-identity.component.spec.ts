import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserIdentityComponent } from './user-identity.component';

describe('UserIdentityComponent', () => {
  let component: UserIdentityComponent;
  let fixture: ComponentFixture<UserIdentityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserIdentityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
