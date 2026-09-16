import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  SharedCoreModule,
  HeaderComponent,
  PageFrameworkComponent,
} from 'moh-common-lib-angular';
import { SplashPageComponent } from './splash-page/splash-page.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { fakeBackendProvider } from './_developmentHelpers/fake-backend';
import { provideEnvironmentNgxMask } from 'ngx-mask';

const providerList = [];

if (
  environment.developmentMode.enabled &&
  environment.developmentMode.mockBackend.enabled
) {
  // provider used to create fake backend - development with backend
  providerList.push(fakeBackendProvider);
}

@NgModule({
  declarations: [AppComponent, SplashPageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedCoreModule,
    HttpClientModule,
    HeaderComponent,
    PageFrameworkComponent,
  ],
  providers: [provideEnvironmentNgxMask(), ...providerList],
  bootstrap: [AppComponent],
})
export class AppModule {}
