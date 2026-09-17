import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinValidationComponent } from './sin-validation.component';

describe('SinValidationComponent', () => {
  let component: SinValidationComponent;
  let fixture: ComponentFixture<SinValidationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SinValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
