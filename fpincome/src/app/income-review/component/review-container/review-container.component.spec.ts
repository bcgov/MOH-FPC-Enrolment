import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewContainerComponent } from './review-container.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FinancialInputComponent } from '../financial-input/financial-input.component';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedCoreModule } from 'moh-common-lib';

describe('ReviewContainerComponent', () => {
  let component: ReviewContainerComponent;
  let fixture: ComponentFixture<ReviewContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewContainerComponent, FinancialInputComponent],
      imports: [RouterTestingModule, TextMaskModule, SharedCoreModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
