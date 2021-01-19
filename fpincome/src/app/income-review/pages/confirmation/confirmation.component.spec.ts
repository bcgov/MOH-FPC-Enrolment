import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfirmationComponent } from './confirmation.component';
import { SharedCoreModule } from 'moh-common-lib';
import { ReviewContainerComponent } from '../../component/review-container/review-container.component';
import { FinancialInputComponent } from '../../component/financial-input/financial-input.component';
import { TextMaskModule } from 'angular2-text-mask';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmationComponent,
        ReviewContainerComponent,
        FinancialInputComponent,
      ],
      imports: [RouterTestingModule, SharedCoreModule, TextMaskModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
