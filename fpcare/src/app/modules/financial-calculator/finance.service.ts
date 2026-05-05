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

  constructor() { }

  /**
   * An input mask for currency formatting. If you just want to format a string
   * use `currencyFormat()` This format does NOT include the $ at the beginning
   * so be sure to add it directly to your template.
   */
  /** ngx-mask pattern: up to 10 digits, comma-separated thousands, 2 optional decimals */
  public moneyMask = 'separator.2';
  public moneyMaskLg = 'separator.2';

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
    console.warn('Failed to load assistance levels from API, using fallback data:', error);
    // Provide representative fallback data so the calculator can still render.
    // Calling _hasData.error() would permanently break the Subject; use setAssistanceLevels instead.
    const fallback = [
      { startRange: '0',      endRange: '25000',     deductible: '$0',    pharmaCarePortion: '100%', maximum: '$0'    },
      { startRange: '25001',  endRange: '35000',     deductible: '$600',  pharmaCarePortion: '75%',  maximum: '$1200' },
      { startRange: '35001',  endRange: '45000',     deductible: '$1000', pharmaCarePortion: '70%',  maximum: '$2000' },
      { startRange: '45001',  endRange: '55000',     deductible: '$1500', pharmaCarePortion: '70%',  maximum: '$2500' },
      { startRange: '55001',  endRange: '999999999', deductible: '$2000', pharmaCarePortion: '70%',  maximum: '$3000' },
    ];
    this.setAssistanceLevels(fallback, fallback);
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
  public findAssistanceLevel(familyNetIncome: number = 0, config?: { bornBefore1939: boolean }): PharmaCareAssistanceLevel {

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
   * Format values upto $999,999,999.99
   * @param {number} currency
   * @param {boolean} withDollarSign
   * @returns {string}
   */
  public currencyFormat(currency: number, withDollarSign = false): string {

    return this._currencyFormat(currency, this.moneyMask, withDollarSign );
  }


  /**
   * Format values larger than $999,999,999.99
   * @param {number} currency
   * @param {boolean} withDollarSign
   * @returns {string}
   */
  public currencyFormatLg(currency: number, withDollarSign = false): string {

    return this._currencyFormat(currency, this.moneyMaskLg, withDollarSign );
  }

  /**
   * Format values to currency
   * @param {number} currency
   * @param {string} moneyMask
   * @param {boolean} withDollarSign
   * @returns {string}
   * @private
   */
  private _currencyFormat(currency: number, _moneyMask: any, withDollarSign = false): string {

    if ( undefined === currency || null === currency )  {
      return null;
    }

    let strVal = currency.toString();
    if ( decimalsRegex.exec( strVal ) ) {
      strVal = currency.toFixed( 2 );
    }

    const parts = strVal.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
    return `${withDollarSign ? '$' : ''}${formatted}`;
  }


  // BUSINESS RULE METHODS ----------------------------------------------------
  // The below methods are defined in Functional Requirement Documents

  public calculateFamilyNetIncome(applicantIncome: number = 0, spouseIncome: number = 0) {
    //Family Net Income = Applicant's Net Income (I01) + Spouse's Net Income (I03)

    /**
     * ST17305 Fix
     * There is some bug in typescript that causes incorrect values to be calculated when one number has 2 decimals
     * and the other has 1 decimal. (e.g. 1000,9 + 1000.01 results in 1000.9099999 rather then 1000.91)
     */
    const familyNetIncome = applicantIncome + spouseIncome;
    return Number( familyNetIncome.toFixed(2) );
  }

  public calculateFamilyRdsp(applicantRdsp: number = 0, spouseRdsp: number = 0) {
    // Family RDSP amount (I05) = Applicants  RDSP amount  + Spouses  RDSP amount
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
   * @param {string} str
   * @returns {number}
   */
  public currencyStrToNumber( str: string | number, withDollarSign: boolean = false ): number {

    if ( str !== null && str !== undefined && str !== '' ) {

      // ngx-mask may emit a number directly via ngModelChange; coerce to string before parsing.
      let value = String(str).replace(/,/g, '');

      if (withDollarSign) {
        value = value.replace( '$', '');
      }
      return Number(value);
    }

    return null;
  }
}
