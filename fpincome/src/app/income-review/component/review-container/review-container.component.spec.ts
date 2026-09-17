import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewContainerComponent } from './review-container.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FinancialInputComponent } from '../financial-input/financial-input.component';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';
import { SharedCoreModule } from 'moh-common-lib-angular';

describe('ReviewContainerComponent', () => {
  let component: ReviewContainerComponent;
  let fixture: ComponentFixture<ReviewContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewContainerComponent, FinancialInputComponent],
        imports: [RouterTestingModule, NgxMaskDirective, SharedCoreModule],
        providers: [provideEnvironmentNgxMask()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
