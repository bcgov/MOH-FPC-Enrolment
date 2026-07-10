/**
 * Public API for moh-common-lib-angular
 * Used by consuming apps (e.g. fpcare) via yalc for local development testing.
 * NOTE: This is a temporary barrel file pending proper ng-packagr library setup.
 */

// Models
export { Base } from './lib/models/base';
export { Address } from './lib/models/address.model';
export { Person } from './lib/models/person.model';
export type { SimpleDate } from './lib/models/simple-date.interface';
export { AbstractForm } from './lib/models/abstract-form';
export { AbstractBaseForm } from './lib/models/abstract-base-form';
export { AbstractFormControl } from './lib/models/abstract-form-control';
export { AbstractReactForm } from './lib/models/abstract-react-form';
export { Container, WizardProgressItem } from './lib/models/container';
export type { ErrorMessage } from './lib/models/error-message.interface';
export { CommonImage, CommonImageError, CommonImageProcessingError, CommonImageScaleFactorsImpl } from './lib/models/images.model';
export { LETTER, NUMBER, SPACE } from './lib/models/mask.constants';

// Services
export { AbstractHttpService } from './lib/services/abstract-api-service';
export { GeocoderService, GeoAddressResult } from './lib/services/geocoder.service';
export { AbstractPageGuardService } from './lib/services/abstract-page-guard.service';
export { DefaultPageGuardService } from './lib/services/default-page-guard.service';
export { LoadPageGuardService } from './lib/services/load-page-guard.service';
export { PageStateService } from './lib/services/page-state.service';
export { ContainerService } from './lib/services/container.service';
export { AbstractPgCheckService } from './lib/services/abstract-pg-check.service';
export { CheckCompleteBaseService } from './lib/services/check-complete-base.service';
export { RouteGuardService } from './lib/services/route-guard.service';
export { CommonLogger, CommonLogEvents } from './lib/services/logger.service';

// Components
export { AddressComponent } from './lib/components/address/address.component';
export { AddressValidatorComponent } from './lib/components/address-validator/address-validator.component';
export { AccordionCommonComponent } from './lib/components/accordion/accordion.component';
export { ButtonComponent } from './lib/components/button/button.component';
export { CheckboxComponent } from './lib/components/checkbox/checkbox.component';
export { CityComponent } from './lib/components/city/city.component';
// ConsentModalComponent is not exported (class body is commented out in the lib)
// export { ConsentModalComponent } from './lib/components/consent-modal/consent-modal.component';
export { CountryComponent } from './lib/components/country/country.component';
export { EmailComponent } from './lib/components/email/email.component';
export { ErrorContainerComponent } from './lib/components/error-container/error-container.component';
export { FullNameComponent } from './lib/components/full-name/full-name.component';
export { HeaderComponent } from './lib/components/header/header.component';
export { NameComponent } from './lib/components/name/name.component';
// PasswordComponent uses zxcvbn (not a fpcare dependency) — import directly if needed
// export { PasswordComponent } from './lib/components/password/password.component';
export { PhnComponent } from './lib/components/phn/phn.component';
export { PhoneNumberComponent } from './lib/components/phone-number/phone-number.component';
export { ProvinceComponent } from './lib/components/province/province.component';
export { RadioComponent } from './lib/components/radio/radio.component';
export { SampleModalComponent } from './lib/components/sample-modal/sample-modal.component';
export { SinComponent } from './lib/components/sin/sin.component';
export { StreetComponent } from './lib/components/street/street.component';

// Helpers
export { deburr } from './helpers/deburr';
export { scrollTo, scrollToError } from './helpers/scroll-helpers';
export { MoHCommonLibraryError } from './helpers/library-error';

// SharedCoreModule — compatibility shim for apps that used moh-common-lib's NgModule.
// The new library uses standalone components. Import individual components directly.
// TODO: Replace SharedCoreModule usage with individual standalone component imports.
import { NgModule } from '@angular/core';
@NgModule({})
export class SharedCoreModule {}
