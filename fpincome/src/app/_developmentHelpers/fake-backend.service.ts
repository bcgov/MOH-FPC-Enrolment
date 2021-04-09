import { Injectable } from '@angular/core';
import {
  SpaEnvResponse,
  MAINT_FLAG_FALSE,
  MAINT_FLAG_TRUE,
} from '../app.constants';
import { environment } from '../../environments/environment';
import { HttpRequest } from '@angular/common/http';
import { parseISO } from 'date-fns/fp';
import { isAfter, isBefore } from 'date-fns/esm';
import { ApiStatusCodes } from 'moh-common-lib';

@Injectable({
  providedIn: 'root',
})
export class FakeBackendService {
  private _splashPageValues: SpaEnvResponse = {
    SPA_ENV_FPIR_MAINTENANCE_FLAG: MAINT_FLAG_FALSE,
    SPA_ENV_FPIR_MAINTENANCE_MESSAGE:
      environment.developmentMode.mockBackend.maintModeMessage,
    SPA_ENV_FPIR_MAINTENANCE_START:
      environment.developmentMode.mockBackend.maintModeStart,
    SPA_ENV_FPIR_MAINTENANCE_END:
      environment.developmentMode.mockBackend.maintModeEnd,
  };

  constructor() {}

  // Return splash page values
  getEnvSpaValues(request: HttpRequest<any>): any {
    if (
      this._splashPageValues.SPA_ENV_FPIR_MAINTENANCE_START &&
      this._splashPageValues.SPA_ENV_FPIR_MAINTENANCE_END
    ) {
      const curDt = new Date();
      const startDt = parseISO(
        this._splashPageValues.SPA_ENV_FPIR_MAINTENANCE_START
      );
      const endDt = parseISO(
        this._splashPageValues.SPA_ENV_FPIR_MAINTENANCE_END
      );

      if (isAfter(curDt, startDt) && isBefore(curDt, endDt)) {
        console.log('set maintenance on');
        this._splashPageValues.SPA_ENV_FPIR_MAINTENANCE_FLAG = MAINT_FLAG_TRUE;
      } else {
        console.log('set maintenance off');
        this._splashPageValues.SPA_ENV_FPIR_MAINTENANCE_FLAG = MAINT_FLAG_FALSE;
      }
    }

    return {
      SPA_ENV_FPIR_MAINTENANCE_FLAG: this._splashPageValues
        .SPA_ENV_FPIR_MAINTENANCE_FLAG,
      SPA_ENV_FPIR_MAINTENANCE_START: this._splashPageValues
        .SPA_ENV_FPIR_MAINTENANCE_START,
      SPA_ENV_FPIR_MAINTENANCE_END: this._splashPageValues
        .SPA_ENV_FPIR_MAINTENANCE_END,
      SPA_ENV_FPIR_MAINTENANCE_MESSAGE: this._splashPageValues
        .SPA_ENV_FPIR_MAINTENANCE_MESSAGE,
    };
  }

  logMessage(request: HttpRequest<any>): any {
    console.log('log message: ', request.body);
    return 'success';
  }

  // Application Response
  processApplication(request: HttpRequest<any>): any {
    console.log('Application request: ', request);
    if (environment.developmentMode.mockBackend.executeErrorScenario) {
      return {
        applicationUUID: request.body.applicationUUID,
        requestUUID: request.body.requestUUID,
        returnCode: ApiStatusCodes.ERROR,
      };
    }
    return {
      applicationUUID: request.body.applicationUUID,
      requestUUID: request.body.requestUUID,
      returnCode: ApiStatusCodes.SUCCESS,
      referenceNumber: this._generateReferenceNumber(),
    };
  }

  // Attachment response
  processAttachment(request: HttpRequest<any>): any {
    // Information is in the URL
    const start = request.url.indexOf('fpcareAttachment');
    const end = request.url.indexOf('?');
    const items = request.url.substring(start, end).split('/');

    if (environment.developmentMode.mockBackend.executeErrorScenario) {
      return JSON.stringify({
        documentuuid: items[1],
        attachmentuuid: items[3],
        errorMessage: 'Attachment UUIDs must be unique. - Fake-backend',
        returnCode: 500,
      });
    }

    return JSON.stringify({
      documentuuid: items[1],
      attachmentuuid: items[3],
      returnCode: 200,
    });
  }

  private _generateReferenceNumber(): string {
    return String(Math.round(Math.random() * 99999999));
  }
}
