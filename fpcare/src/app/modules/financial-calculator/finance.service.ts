import { Injectable } from '@angular/core';
import { PharmaCareAssistanceLevel, PharmaCareAssistanceLevelServerResponse } from './assistance-levels.interface';
import { BehaviorSubject } from 'rxjs';

export const decimalsRegex = /\.([0-9]{1,2})/;

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  public PharmaCareAssistanceLevels: PharmaCareAssistanceLevel[];
  public Pre1939PharmaCareAssistanceLevels: PharmaCareAssistanceLevel[];

  private _hasData = new BehaviorSubject<boolean>(false);
  /** Subscribe to this observable to check it's true prior to accessing this.PharmacareAssistanceLevels / Pre1939 */
  public hasData = this._hasData.asObservable();

  /**
   * ngx-mask pattern for currency input fields. If you just want to format a
   * string use `currencyFormat()`. This format does NOT include the $ at the
   * beginning so be sure to add it directly to your template.
   */
  public moneyMask = 'separator.2';

  public setAssistanceLevels(baseline: PharmaCareAssistanceLevelServerResponse[], pre1939: PharmaCareAssistanceLevelServerResponse[]){
    // Change strings of numbers into numbers, as we do math on them
    this.PharmaCareAssistanceLevels = baseline.map(item => this.convertServerResponse(item));
    this.Pre1939PharmaCareAssistanceLevels = pre1939.map(item => this.convertServerResponse(item));

    this._hasData.next(true);
  }

  private convertServerResponse(serverResponse: PharmaCareAssistanceLevelServerResponse): PharmaCareAssistanceLevel {

    return {
      startRange: Number(serverResponse.startRange),
      endRange: Number(serverResponse.endRange),
      deductible: Number(serverResponse.deductible.replace('$', '')),
      pharmaCarePortion: Number(serverResponse.pharmaCarePortion.replace('%', '')),
      maximum: Number(serverResponse.maximum.replace('$', ''))
    };
  }

  public failedToLoadAssistanceLevels(error): void {
    this._hasData.error(error);
  }

  /**
   * Looks up the official PharmaCare Assistance Level for a given income.
   *
   * An optional configuration object can be passed in to lookup values from the
   * 1939 table. If it is omitted, the recent table is used.
   *
   * @param {number} [familyNetIncome=0]
   * @param {{bornBefore1939: boolean}} [config]
   * @returns {PharmaCareAssistanceLevel}
   * @memberof FinanceService
   */
  public findAssistanceLevel(familyNetIncome = 0, config?: { bornBefore1939: boolean }): PharmaCareAssistanceLevel {

    if ( !this.PharmaCareAssistanceLevels  || !this.Pre1939PharmaCareAssistanceLevels ) {
      console.error( 'Assistance levels not loaded', this.PharmaCareAssistanceLevels, this.Pre1939PharmaCareAssistanceLevels );
      return null;
    }

    let source = this.PharmaCareAssistanceLevels;
    if (config && config.bornBefore1939) {
      source = this.Pre1939PharmaCareAssistanceLevels;
    }

    return source
      .find(item => item.startRange <= familyNetIncome && item.endRange >= familyNetIncome);
  }

  /**
   * Format a currency value with thousands separators and, when the value
   * has a fractional part, exactly 2 decimal places.
   * @param {number} currency
   * @param {boolean} withDollarSign
   * @returns {string}
   */
  public currencyFormat(currency: number, withDollarSign = false): string {

    return this._currencyFormat(currency, withDollarSign );
  }

  /**
   * Format values to currency: thousands separators, and exactly 2 decimal
   * places only when the input value itself has a fractional part.
   * @param {number} currency
   * @param {boolean} withDollarSign
   * @returns {string}
   * @private
   */
  private _currencyFormat(currency: number, withDollarSign = false): string {

    // We want the value of zero to be formatted
    if ( undefined === currency || null === currency )  {
      return null;
    }

    const hasDecimals = decimalsRegex.exec( currency.toString() ) !== null;
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    }).format(currency);

    return `${withDollarSign ? '$' : ''}${formatted}`;
  }


  // BUSINESS RULE METHODS ----------------------------------------------------
  // The below methods are defined in Functional Requirement Documents

  public calculateFamilyNetIncome(applicantIncome = 0, spouseIncome = 0) {
    //Family Net Income = Applicant's Net Income (I01) + Spouse's Net Income (I03)

    /**
     * ST17305 Fix
     * There is some bug in typescript that causes incorrect values to be calculated when one number has 2 decimals
     * and the other has 1 decimal. (e.g. 1000,9 + 1000.01 results in 1000.9099999 rather then 1000.91)
     */
    const familyNetIncome = applicantIncome + spouseIncome;
    return Number( familyNetIncome.toFixed(2) );
  }

  public calculateFamilyRdsp(applicantRdsp = 0, spouseRdsp = 0) {
    // Family RDSP amount (I05) = Applicants  RDSP amount  + Spouses  RDSP amount
    /**
     * ST17305 Fix
     * There is some bug in typescript that causes incorrect values to be calculated when one number has 2 decimals
     * and the other has 1 decimal. (e.g. 1000,9 + 1000.01 results in 1000.9099999 rather then 1000.91)
     */
    const familyTotalRdsp = applicantRdsp + spouseRdsp;
    return Number( familyTotalRdsp.toFixed(2) );
  }

  public calculateFamilyAdjustedIncome(familyNetIncome: number, disability: number): number {
    //Family Adjusted Income = Family Net Income - Family RDSP amount (I05)
    const adjustedIncome = familyNetIncome - disability;
    if (adjustedIncome < 0) {
      return 0;
    }
    return Number(adjustedIncome.toFixed( 2 ));
  }


  /**
   * Convert the currency string to a numeric
   * @param {string|number} str
   * @returns {number}
   */
  public currencyStrToNumber( str: string | number, withDollarSign = false ): number {

    if ( str === null || str === undefined || str === '' ) {
      return null;
    }

    // ngx-mask can emit a number directly via ngModelChange; coerce to string before parsing.
    let value = String(str).replace(/,/g, '');

    if (withDollarSign) {
      value = value.replace( '$', '');
    }
    return Number(value);
  }
}
