import {
  HTTP_INTERCEPTORS,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { FakeBackendService } from './fake-backend.service';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor(private fakebackendService: FakeBackendService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // wrap in delayed observable to simulate server api call
    return of(null).pipe(
      mergeMap(() => {
        console.log('Request (fakeBackend interceptor)', request);

        if ('POST' === request.method) {
          let payload = null;
          console.log('Post method');

          if (request.url.includes(environment.api.envServerUrl)) {
            console.log('Fake-backend for spa-env');
            payload = this.fakebackendService.getEnvSpaValues(request);
          }

          if (request.url.includes(environment.api.loggingURL)) {
            console.log('Fake-backend for logging - nothing logged');
            payload = this.fakebackendService.logMessage(request);
          }

          if (request.url.includes(environment.api.baseAPIUrl)) {
            if (request.url.endsWith(environment.api.application)) {
              console.log('Fake-backend for application');
              payload = this.fakebackendService.processApplication(request);
            }
          }

          if (request.url.includes(environment.api.attachments)) {
            console.log('Fake-backend for attachments');
            payload = this.fakebackendService.processAttachment(request);
          }

          if (payload) {
            console.log('Sending reponse from fake-backend: ', payload);
            return of(new HttpResponse({ status: 200, body: payload })).pipe(
              delay(2500)
            );
          }
        }

        // Pass through to actual service
        return next.handle(request);
      })
    );
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
