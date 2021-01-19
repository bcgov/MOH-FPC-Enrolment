import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedCoreModule } from 'moh-common-lib';
import { SplashPageComponent } from './splash-page/splash-page.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { fakeBackendProvider } from './_developmentHelpers/fake-backend';

const providerList: any = [];

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
  ],
  providers: [providerList],
  bootstrap: [AppComponent],
})
export class AppModule {}
