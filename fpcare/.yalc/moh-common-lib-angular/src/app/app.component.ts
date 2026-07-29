import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { PhnComponent } from '../lib/components/phn/phn.component';
import { AddressComponent } from '../lib/components/address/address.component';

// import { NameComponent } from "../lib/components/name/name.component";
// import { Person } from '../lib/models/person.model';
// import { FullNameComponent } from "../lib/components/full-name/full-name.component";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    PhnComponent,
    AddressComponent,
    // NameComponent,
    // FullNameComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @Input() country = 'CANADA';
  @Input() state = 'ONTARIO';
  @Input() city = 'Vancouver';
  @Input() zip = 'V5K0A1';
  @Input() street = 'Unit 653';
  @Input() address = '653 main street';
  @Input() address2 = 'Unit 123';
  @Input() address3 = 'Unit 234';

  title = 'moh-common-lib-angular';

  // person: Person = {
  //   firstName: '',
  //   middleName: '',
  //   lastName: '',
  //   dobFormat: '',
  //   apiDobFormat: '',
  //   dateOfBirth: new Date(),
  //   dateOfBirthShort: '',
  //   formatDateOfBirth: '',
  //   name: null,
  //   fullname: null,
  //   getAge: function (): number {
  //     throw new Error('Function not implemented.');
  //   },
  //   copy: function (): void {
  //     throw new Error('Function not implemented.');
  //   },
  //   objectId: ''
  // };
}
