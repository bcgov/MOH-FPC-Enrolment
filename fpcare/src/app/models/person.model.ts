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
  sDateOfBirth = {year: null, month: null, day: null};

  constructor() {
    super();

    // Set date of birth string format for read only fields
    this.dobFormat = 'MMMM DD, YYYY';
  }

  // Wrapper - TODO: Figure out how to get date to convert to date form - may need to create new method - AM 
  // project
  get sDateOfBirthShort() {
 
    // All value must numbers
    if (this.isNumeric(this.sDateOfBirth.year) &&
        (this.isNumeric(this.sDateOfBirth.month) && this.sDateOfBirth.month > 0) &&
        this.isNumeric(this.sDateOfBirth.day)) {
        console.log('set sDateOfBirth - build Date');
        this.dateOfBirth = new Date(this.sDateOfBirth.year,
                                    this.sDateOfBirth.month - 1,
                                    this.sDateOfBirth.day);
    }
    return this.dateOfBirthShort;
  }

  get sFormatDateOfBirth() {
    // All value must numbers
    if (this.isNumeric(this.sDateOfBirth.year) &&
    (this.isNumeric(this.sDateOfBirth.month) && this.sDateOfBirth.month > 0) &&
    this.isNumeric(this.sDateOfBirth.day)) {
    console.log('set sDateOfBirth - build Date');
    this.dateOfBirth = new Date(this.sDateOfBirth.year,
                                this.sDateOfBirth.month - 1,
                                this.sDateOfBirth.day);
    }
    return this.formatDateOfBirth;
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

  private isNumeric(val: number): boolean {
    return val !== null && val !== undefined ? !isNaN(val) : false;
  }

}

