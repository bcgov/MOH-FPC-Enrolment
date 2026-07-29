import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';


import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    NgxMaskDirective,
    NgxMaskPipe,
    
  ],
  providers: [provideNgxMask()],
 // bootstrap: [AppComponent]
})
export class AppModule { }
