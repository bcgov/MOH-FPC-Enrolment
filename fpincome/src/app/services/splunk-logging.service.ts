import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CommonLogger } from 'moh-common-lib';
import { UUID } from 'angular2-uuid';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SplunkLoggingService extends CommonLogger {
  constructor(protected http: HttpClient) {
    super(http);
    this.setURL(environment.api.loggingURL);
    this.programName = 'fpincome';
    // generate session per refresh as no state persists.
    this.applicationId = UUID.UUID();
  }
}
