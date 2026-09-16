import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfirmationComponent } from './confirmation.component';
import {
  SharedCoreModule,
  PageFrameworkComponent,
  ConfirmTemplateComponent,
} from 'moh-common-lib-angular';
import { ReviewContainerComponent } from '../../component/review-container/review-container.component';
import { FinancialInputComponent } from '../../component/financial-input/financial-input.component';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ConfirmationComponent,
          ReviewContainerComponent,
          FinancialInputComponent,
        ],
        imports: [
          RouterTestingModule,
          SharedCoreModule,
          NgxMaskDirective,
          PageFrameworkComponent,
          ConfirmTemplateComponent,
        ],
        providers: [provideEnvironmentNgxMask()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
