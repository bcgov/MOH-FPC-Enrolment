import { Injectable } from '@angular/core';
import { AbstractHttpService } from 'moh-common-lib';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { retry } from 'rxjs/operators';
import { FPIR_SPA_ENV_CONFIG, SpaEnvResponse } from '../app.constants';
import { SplunkLoggingService } from './splunk-logging.service';

/**
 * Responsible for retrieving values from the spa-env-server on OpenShift.
 */
@Injectable({
  providedIn: 'root',
})
export class SpaEnvApiService extends AbstractHttpService {
  protected _headers: HttpHeaders = new HttpHeaders({
    SPA_ENV_NAME: JSON.stringify(FPIR_SPA_ENV_CONFIG),
  });

  constructor(
    protected http: HttpClient,
    private splunkLoggingService: SplunkLoggingService
  ) {
    super(http);

    this.logHTTPRequestsToConsole =
      environment.developmentMode.logHTTPRequestsToConsole;
  }

  public getEnvs() {
    const url = environment.api.envServerUrl;

    // When the SpaEnv server is being deployed it can return an HTML error
    // page, and it should resolve shortly, so we try again.
    return this.post<SpaEnvResponse>(url, null).pipe(retry(3));
  }

  protected handleError(error: HttpErrorResponse) {
    // console.log( 'Error handleError: ', error );

    if (error.error instanceof ErrorEvent) {
      // Client-side / network error occured
      console.error('An error occured: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Backend returned error code: ${error.status}.  Error body: ${error.error}`
      );
    }

    // Log error to logging service
    this.splunkLoggingService.logHttpError(error);

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return throwError('Something went wrong with the network request.');
  }
}
