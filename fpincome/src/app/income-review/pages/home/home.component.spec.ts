import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  inject,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SharedCoreModule,
  PageFrameworkComponent,
  PageSectionComponent,
  RadioComponent,
  ErrorContainerComponent,
} from 'moh-common-lib-angular';
import { CaptchaModule } from 'moh-common-lib-angular/captcha';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { HomeComponent } from './home.component';
import { CollectionNoticeComponent } from '../../component/collection-notice/collection-notice.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import {
  getDebugElement,
  setInput,
  clickRadioButton,
  MockRouter,
  partialRequiredMsg,
  getRadioErrorMsg,
  getErrorMsg,
} from '../../../_developmentHelpers/test-helpers';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { Router } from '@angular/router';

class MockDataService {
  isRegistered: boolean;
  isIncomeLess: boolean;
  informationCollectionNoticeConsent: boolean;
}

function setRadioButton(
  fixture: ComponentFixture<any>,
  btnName: string,
  valueName: string
) {
  const radioBtn = getDebugElement(fixture, 'common-radio', btnName);
  clickRadioButton(radioBtn, valueName);
}

function getCollectionNoticeButton(fixture: ComponentFixture<any>) {
  return getDebugElement(
    fixture,
    'fpir-collection-notice .modal-footer button'
  );
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomeComponent, CollectionNoticeComponent],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          SharedCoreModule,
          HttpClientTestingModule,
          CaptchaModule,
          ModalModule.forRoot(),
          PageFrameworkComponent,
          PageSectionComponent,
          RadioComponent,
          ErrorContainerComponent,
        ],
        providers: [
          provideEnvironmentNgxMask(),
          { provide: ComponentFixtureAutoDetect, useValue: true },
          { provide: Router, useClass: MockRouter },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display collection notice', () => {
    expect(component.infoCollectionModal).toBeTruthy();
  });

  it('should have button on collection notice disabled', () => {
    const button = getCollectionNoticeButton(fixture);
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should be able to close the collection notice when button is enabled', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    // The captcha's answer input lives inside the captcha's own form, so its
    // NgModel registers through NgForm.addControl, which defers setUpControl
    // to a microtask. Until that runs, the value accessor's onChange is still
    // a no-op: setInput's typed value never reaches `answer`, answerChanged
    // sees an empty string, and no verify request is issued.
    await fixture.whenStable();

    // Drive the captcha to a valid token the way a real user would: type a
    // 6-character answer, then respond to the verification request the
    // captcha issues, so `onValidToken` actually fires.
    setInput(fixture.debugElement, 'answer', 'irobot');
    fixture.detectChanges();

    const verifyReq = httpMock.expectOne(
      `${component.captchaApiUrl}/verify/captcha`
    );
    verifyReq.flush({ valid: true, jwt: 'test-jwt' });

    await fixture.whenRenderingDone();
    fixture.detectChanges();

    const button = getCollectionNoticeButton(fixture);
    expect(button.nativeElement.disabled).toBeFalsy();

    // `isShown` is ngx-bootstrap's own open/closed flag, and it flips
    // synchronously on click. The modal is animated, so the display and
    // aria-hidden attributes lag by the 300ms transition.
    // Asserted as exactly true and false so that a renamed getter reading
    // undefined fails here instead of passing.
    expect(
      component.infoCollectionModal.collectionNoticeModal.isShown
    ).toBeTrue();

    button.nativeElement.click();
    fixture.detectChanges();

    expect(
      component.infoCollectionModal.collectionNoticeModal.isShown
    ).toBeFalse();
  });

  // Logic test for continuing
  it('should display required error when mandatory fields are empty', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.informationCollectionNoticeConsent = true;

      expect(component.canContinue()).toBeFalsy();
      component.continue();
      fixture.detectChanges();

      expect(getRadioErrorMsg(fixture, 'isRegistered')).toContain(
        partialRequiredMsg
      );
      expect(getRadioErrorMsg(fixture, 'isIncomeLess')).toContain(
        partialRequiredMsg
      );
    }
  ));

  it('should display error messages when requirements are not satisfied', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.informationCollectionNoticeConsent = true;
      const registError =
        'Income reviews are for people who are registered for the income-based Fair PharmaCare plan. ' +
        'You can register here. You can only apply for an income review once you have registered for ' +
        'Fair PharmaCare and received a Confirmation of Assistance letter.';
      const incomeError =
        'Income reviews are only for Fair PharmaCare registrants whose income has dropped by 10% ' +
        'or more since it was verified two years ago.';

      // Not registered and income is not 10% less
      setRadioButton(fixture, 'isRegistered', 'false');
      setRadioButton(fixture, 'isIncomeLess', 'false');
      component.continue();
      fixture.detectChanges();

      expect(getErrorMsg(fixture, 0)).toContain(registError);
      expect(getErrorMsg(fixture, 1)).toContain(incomeError);

      // Registered but income not 10% less
      setRadioButton(fixture, 'isRegistered', 'true');
      component.canContinue();
      fixture.detectChanges();

      expect(getErrorMsg(fixture, 0)).toContain(incomeError);

      // Not registered but income is 10% less
      setRadioButton(fixture, 'isRegistered', 'false');
      setRadioButton(fixture, 'isIncomeLess', 'true');
      component.continue();
      fixture.detectChanges();

      expect(getErrorMsg(fixture, 0)).toContain(registError);
    }
  ));

  it('should coninue when eligibility requirements are satisfied', inject(
    [IncomeReviewDataService, Router],
    (mockDataService: MockDataService, mockRouter: MockRouter) => {
      mockDataService.informationCollectionNoticeConsent = true;

      setRadioButton(fixture, 'isRegistered', 'true');
      setRadioButton(fixture, 'isIncomeLess', 'true');

      expect(component.canContinue()).toBeTruthy();
      component.continue();
      expect(mockRouter.url).toBe(INCOME_REVIEW_PAGES.PERSONAL_INFO.fullpath);
    }
  ));
});
