import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingAddressPageComponent } from './mailing-address.component';
import { CoreModule } from '../../../core/core.module';
import {FPCareDataService} from '../../../../services/fpcare-data.service';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {RegistrationService} from '../../registration.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GeocoderInputComponent } from 'app/modules/geocoder/components/geocoder-input/geocoder-input.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

describe('MailingAddressComponent', () => {
  let component: MailingAddressPageComponent;
  let fixture: ComponentFixture<MailingAddressPageComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MailingAddressPageComponent,
        GeocoderInputComponent
      ],
      imports: [
        CoreModule,
        RouterTestingModule,
        FormsModule,
        CoreModule,
        HttpClientTestingModule,
        TypeaheadModule
      ],
      providers: [
        // Reverted to full DataService, as we make use of its str format function
        // { provide: FPCareDataService, useValue: fPCareDataServiceStub },
        FPCareDataService,
        RegistrationService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cannot continue by default', () => {
    expect(component.canContinue()).toBeFalsy();
  });
});
