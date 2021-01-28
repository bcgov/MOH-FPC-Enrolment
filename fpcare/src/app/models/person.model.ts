import { Person, SimpleDate } from 'moh-common-lib';
import { FPCAddress } from './address.model';

/**
 * Information about person. Should be relevant to all people in app, from the
 * logged in user to people only displayed in records.
 */
export class FPCPerson extends Person {

  // Personal Health Number (validation mod 11 check - reuse logic from old web app)
  public phn: string;

  // Social Insurance Number (validation mod 10 check - reuse logic from old web app)
  public sin: string;

  // FPCare registration number
  public fpcRegNumber: string;

  // Contact information for person
  /* Mailing address for person */
  public address: FPCAddress = new FPCAddress();
  public updAddress: FPCAddress = new FPCAddress();

  // Simple date, keep functionality of app with new library
  private _sDateOfBirth = {year: null, month: null, day: null};

  constructor() {
    super();

    // Set date of birth string format for read only fields
    this.dobFormat = 'MMMM DD, YYYY';
  }

  // Wrapper
  set sDateOfBirth(dob: SimpleDate) {
    this._sDateOfBirth = dob;
    // All value must numbers
    if (!isNaN(this._sDateOfBirth.year) &&
        (!isNaN(this._sDateOfBirth.month) && this._sDateOfBirth.month > 1) &&
        !isNaN(this._sDateOfBirth.day)) {
        this.dateOfBirth = new Date(this._sDateOfBirth.year,
                                    this._sDateOfBirth.month - 1,
                                    this._sDateOfBirth.day);
    }
  }
  get sDateOfBirth(): SimpleDate {
      return this._sDateOfBirth;
  }

  /**
   *
   * @returns {boolean}
   */
  get isAddressUpdated(): boolean {
    return this.updAddress.isComplete();
  }

  // Remove formatting
  getNonFormattedPhn(): string {
    return this.removeStrFormat( this.phn );
  }

  getNonFormattedSin(): string {
    return this.removeStrFormat( this.sin );
  }

  getNonFormattedPostalCode(): string {
    return this.removeStrFormat( this.address.postal );
  }

  getNonFormattedUpdPostalCode(): string {
    return this.removeStrFormat( this.updAddress.postal );
  }

  /**
   *
   * @param {string} value
   * @returns {string}
   */
  private removeStrFormat( value: string ): string {

    return (value ? value.replace(/ /g, '') : null);
  }
}

