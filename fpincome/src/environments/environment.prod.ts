export const environment = {
  production: true,

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
    enabled: false,

    /**
     * Bypass page guards
     */
    bypassGuards: false,

    /**
     * log HTTP requests to console
     */
    logHTTPRequestsToConsole: false,

    /**
     * Simulate back-end
     */
    mockBackend: {
      enabled: false,
      executeErrorScenario: false,

      // YYYY-MM-DD 24H:mm:ss
      maintModeStart: '',
      maintModeEnd: '',
      maintModeMessage: '',
    },
  },
};
