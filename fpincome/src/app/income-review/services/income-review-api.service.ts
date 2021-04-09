import { Injectable } from '@angular/core';
import {
  AbstractHttpService,
  CommonImage,
  CommonLogEvents,
} from 'moh-common-lib';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { SplunkLoggingService } from '../../services/splunk-logging.service';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FpcDocumentTypes } from './income-review-data.service';
import { ServerPayload } from '../models/review-income-api';

@Injectable({
  providedIn: 'root',
})
export class IncomeReviewApiService extends AbstractHttpService {
  protected _headers: HttpHeaders;

  private _token;

  constructor(
    protected http: HttpClient,
    private splunkLoggingServicece: SplunkLoggingService
  ) {
    super(http);
    this.logHTTPRequestsToConsole =
      environment.developmentMode.logHTTPRequestsToConsole;
  }

  public setCaptchaToken(token: string) {
    this._token = token;
    this._headers = this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': `Bearer ${this._token}`,
    });
  }

  /**
   * Submit request to be processed
   * @param jsonPayLoad information for processing income review request
   * @param supportDocuments documents supporting income review request
   */
  submitApplication(
    jsonPayLoad: any,
    supportDocuments: CommonImage<FpcDocumentTypes>[]
  ): Promise<any> {
    // Attach document information to the jsonPayLoad
    const payload = Object.assign(jsonPayLoad, {
      attachments: supportDocuments.map((x) => x.toJSON()),
    });

    return new Promise<ServerPayload>((resolve, reject) => {
      this._uploadDocuments(supportDocuments, jsonPayLoad.applicationUUID)
        .then((attachRes) => {
          return this._submitForm(payload).subscribe(
            (response: ServerPayload) => {
              console.log('submit response: ', response);
              return resolve(response);
            },
            (error) => {
              console.log('submit error: ', error);
              return reject(error);
            }
          );
        })
        .catch((err: Response | any) => {
          console.log('submit catch: ', err);
          return reject(err);
        });
    });
  }

  /**
   * Submit supporting documents uploaded by user
   * @param attachment Images uploaded
   * @param applicationUUID identifier for the application documents belong to
   */
  private _uploadDocuments(
    attachments: CommonImage<FpcDocumentTypes>[],
    applicationUUID: string
  ) {
    return new Promise<string[]>((resolve, reject) => {
      // Make a list of promises for each attachment
      const attachmentPromises = new Array<Promise<string>>();
      for (const attachment of attachments) {
        attachmentPromises.push(
          this._sendDocument(attachment, applicationUUID)
        );
      }

      // Execute all promises and wait for results
      return Promise.all(attachmentPromises)
        .then(
          (responses) => {
            this.splunkLoggingServicece.log({
              event: CommonLogEvents.submission,
              request: `Income Review Attachment - ${attachments.length} attachments submitted`,
              response: 'success',
            });
            resolve(responses);
          },
          (_error: Response | any) => {
            return reject(_error);
          }
        )
        .catch((_error: Response | any) => {
          return reject(_error);
        });
    });
  }

  // Send each document separately
  private _sendDocument(
    attachment: CommonImage,
    applicationUUID: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let url = `${environment.api.attachments}/${applicationUUID}/attachments/${attachment.uuid}`;

      url += `?attachmentdocumenttype=${FpcDocumentTypes.SupportDocument}&programArea=PHARMANET&contentType=1`;

      return this.uploadAttachment(url, attachment)
        .toPromise()
        .then(
          (response) => {
            return resolve(response);
          },
          (_error: Response | any) => {
            this.splunkLoggingServicece.log({
              event: CommonLogEvents.submission,
              request: 'Income Review Attachment - Send Error',
              response: _error,
            });
            return reject(_error);
          }
        )
        .catch((_error: Response | any) => {
          console.log('Error in sending individual attachment: ', _error);
          this.splunkLoggingServicece.log({
            event: CommonLogEvents.submission,
            request: 'Income Review Attachment - Send Error (catch stmt)',
            response: _error,
          });

          reject(_error);
        });
    });
  }

  /**
   * Submit data entered in the income review pages
   * @param jsonPayLoad Data used to process income review
   */
  private _submitForm(jsonPayLoad: any) {
    const url = `${environment.api.baseAPIUrl}/${environment.api.application}`;

    // Add requestUUID to json payload object
    const payload = Object.assign(jsonPayLoad, {
      requestUUID: this.generateUUID(),
    });

    return this.post(url, payload);
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side / network error occured
      console.error('An error occured: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Backend returned error code: ${error.status}.  Error body: ${error.error}`
      );
    }

    this.splunkLoggingServicece.logHttpError(error);

    // A user facing error message /could/ go here; we shouldn't log dev info through the throwError observable
    return throwError('Something went wrong with the network request.');
  }
}
