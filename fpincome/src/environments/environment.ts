// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  /**
   * URLs for API rest calls
   */
  api: {
    envServerUrl: '/fpcare/income-review/api/env', // spa-env service - splash page information
    loggingURL: '/fpcare/income-review/api/logging', // splunk forwarder service
    captchaBaseURL: '/fpcare/income-review/api/captcha', // captcha for authorization
    baseAPIUrl: '/fpcare/income-review/api/fpcareIncome', // middleware url to send requests
    application: 'application', // end point for submitting income review applications
    attachments: '/fpcare/income-review/api/fpcareAttachment', // end point for submitting supporting documents
  },

  /**
   * URL links for other sites
   */
  links: {
    mspSuppBenefits: 'https://www.gov.bc.ca/MSP/supplementarybenefits',
    fpcRegStatus:
      'https://my.gov.bc.ca/fpcare/registration-status/request-status',
    hibc:
      'http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us',
    serviceCanada: 'https://www.canada.ca/',
    fpcRegister:
      // tslint:disable-next-line: max-line-length
      'https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/fair-pharmacare-plan/register-for-fair-pharmacare',
    incomeStmt:
      'https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/a-proof-income-statement-option-print.html',
  },

  /**
   * assist with development - turned off for production
   */
  developmentMode: {
    /** When enabled = true, page guards can be bypassed if bypassGuards = true */
    enabled: true,

    /**
     * Bypass page guards
     */
    bypassGuards: true,

    /**
     * log HTTP requests to console
     */
    logHTTPRequestsToConsole: true,

    /**
     * Simulate back-end
     * When enabled = true, mockBackend can be used when mockBackend: {enabled = true}, loads provider for a fake backend
     */
    mockBackend: {
      enabled: false,
      executeErrorScenario: false,

      // YYYY-MM-DD 24H:mm:ss
      maintModeStart: '2020-05-13 21:45:00',
      maintModeEnd: '2020-05-13 21:50:00',
      maintModeMessage: 'Fair PharmaCare Income Review is unavailable..',
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
