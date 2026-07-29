import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { GeocoderInputComponent } from './geocoder-input.component';
import { GeocoderService } from 'moh-common-lib-angular';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { FPCAddress } from '../../../../models/address.model';

describe('GeocoderInputComponent', () => {
  let component: GeocoderInputComponent;
  let fixture: ComponentFixture<GeocoderInputComponent>;

  let lookupSpy: jest.Mock;
  let geoService: { lookup: jest.Mock };

  // The result when user searches '784 y' - after GeocoderService has processed it
  const yatesResponse = [
    {
      fullAddress: '784 Yates St, Victoria, BC',
      city: 'Victoria',
      street: '784 Yates St',
      country: 'CAN',
      province: 'BC',
    },
    {
      fullAddress: '784 Young Rd, Kelowna, BC',
      city: 'Kelowna',
      street: '784 Young Rd',
      country: 'CAN',
      province: 'BC',
    },
  ];

  beforeEach(waitForAsync(() => {
    lookupSpy = jest.fn().mockReturnValue(of(yatesResponse));
    geoService = { lookup: lookupSpy };

    TestBed.configureTestingModule({
      declarations: [GeocoderInputComponent],
      providers: [{ provide: GeocoderService, useValue: geoService }],
      imports: [
        FormsModule,
        TypeaheadModule.forRoot(),
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeocoderInputComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call GeocoderService.lookup() after initialization', () => {
    expect(lookupSpy).not.toHaveBeenCalled();
  });

  it('should call GeoCoderService.lookup() on a keyUp event', fakeAsync(() => {
    // This simulates the typeahead input's behaviour by subscribing to the observable in the template
    component.typeaheadList$.subscribe();

    component.search = '784 y';
    const keyEvent = new KeyboardEvent('keyup');
    component.onKeyUp(keyEvent);

    tick(500); // same as debounceTime()

    expect(lookupSpy).toHaveBeenCalled();
  }));

  it('should emit an address when one is selected from typeahead', fakeAsync(() => {
    let typeaheadMatch: any;
    component.typeaheadList$.subscribe((x) => {
      typeaheadMatch = { item: x[0] };
      // Simulate user has selected the first typeahead item (i.e. enter/tab/clicked on first item)
      component.onSelect(typeaheadMatch);
    });

    //Check for @Output emit, triggered via the .onSelect() above
    component.addressChange.subscribe((address: FPCAddress) => {
      expect(address).toBeDefined();
      expect(address._geocoderFullAddress).toBe(typeaheadMatch.item.fullAddress);
      expect(address.street).toBe(typeaheadMatch.item.street);
      expect(address.city).toBe(typeaheadMatch.item.city);
      expect(address.province).toBe(typeaheadMatch.item.province);
      expect(address.country).toBe(typeaheadMatch.item.country);
    });

    // Now that listeners are setup, trigger the user input and kick if off
    component.search = '784 y';
    const keyEvent = new KeyboardEvent('keyup');
    component.onKeyUp(keyEvent);
    tick(500); // same as debounceTime()
  }));

  it('should properly show when no results', () => {
    // This is not testing the typeaheadNoResults directive since it's a 3rd
    // party dep, but rather that the method it calls properly updates when
    // passed a boolean

    // Check data
    component.search = 'example';
    fixture.detectChanges();
    component.onNoResults(true);
    expect(component.hasNoResults).toBe(true);

    // Check UI
    const el = fixture.nativeElement.querySelector('.geocoder-status');
    fixture.detectChanges();
    expect(el.textContent).toContain('No Results');
  });

  it('should show an error on network failure', fakeAsync(() => {
    // Force the geocoder service to return an error, then make sure data and UI are updated
    lookupSpy.mockReturnValue(throwError('Geocoder error'));
    component.typeaheadList$.subscribe();

    // Now that listeners are setup, trigger the user input and kick if off
    component.search = '784 y';
    const keyEvent = new KeyboardEvent('keyup');
    expect(component.hasError).toBe(false);
    component.onKeyUp(keyEvent);
    tick(500); // same as debounceTime()
    expect(component.hasError).toBe(true);

    const el = fixture.nativeElement.querySelector('.geocoder-status');
    fixture.detectChanges();
    expect(el.textContent).toContain('Error');
  }));
});
