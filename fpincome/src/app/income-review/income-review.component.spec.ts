import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedCoreModule } from 'moh-common-lib';

import { IncomeReviewComponent } from './income-review.component';

describe('IncomeReviewComponent', () => {
  let component: IncomeReviewComponent;
  let fixture: ComponentFixture<IncomeReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeReviewComponent],
      imports: [RouterTestingModule, SharedCoreModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
