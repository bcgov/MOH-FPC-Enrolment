import { Component, OnInit, OnDestroy } from '@angular/core';
import { SplashPageService } from '../services/splash-page.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MAINT_FLAG_TRUE } from '../app.constants';

@Component({
  selector: 'fpir-splash-page',
  templateUrl: './splash-page.component.html',
})
export class SplashPageComponent implements OnInit, OnDestroy {
  private _subcription: Subscription;

  public startTime: string;
  public endTime: string;
  public message: string;

  constructor(
    private splashService: SplashPageService,
    private router: Router
  ) {}

  ngOnInit() {
    this._subcription = this.splashService.$values.subscribe((values) => {
      if (values) {
        this.startTime = values.SPA_ENV_FPIR_MAINTENANCE_START;
        this.endTime = values.SPA_ENV_FPIR_MAINTENANCE_END;
        this.message = values.SPA_ENV_FPIR_MAINTENANCE_MESSAGE;

        if (values.SPA_ENV_FPIR_MAINTENANCE_FLAG !== MAINT_FLAG_TRUE) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  ngOnDestroy() {
    this._subcription.unsubscribe();
  }
}
