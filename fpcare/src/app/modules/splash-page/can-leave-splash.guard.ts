import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { SplashPageService } from './splash-page.service';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanLeaveSplashGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private splash: SplashPageService){}
  canDeactivate(){
    return !this.splash.maintenanceMode;
  }
}
