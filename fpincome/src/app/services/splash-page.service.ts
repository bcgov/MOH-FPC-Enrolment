import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

import { SpaEnvApiService } from './spa-env-api.service';
import { SpaEnvResponse, APP_ROUTES, MAINT_FLAG_TRUE } from '../app.constants';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Responsible for determing if the splash page (aka maintenance mode) is
 * enabled. It uses the spa-env-server to get these values.
 * \
 * Subscribe to .values() to get the spa env values.
 */

@Injectable({
  providedIn: 'root',
})
export class SplashPageService {
  public isMaintenanceMode: boolean = false;

  /**
   * We use private BehaviorSubjects to get variables instead of repeating HTTP requests.
   */
  private $valueSubject = new BehaviorSubject<SpaEnvResponse>(null);

  public $values: Observable<
    SpaEnvResponse
  > = this.$valueSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private spaEnvApiService: SpaEnvApiService,
    private router: Router
  ) {}

  /**
   * Check if maitenance mode is active, and if so redirect to splash page.
   */
  public setup(): void {
    this.load().then((isMaintenance) => {
      if (isMaintenance) {
        this.router.navigate([APP_ROUTES.maintenance]);
      }
    });
  }

  public load(): Promise<boolean> {
    return new Promise((resolve) => {
      this.spaEnvApiService.getEnvs().subscribe((envs) => {
        if (envs) {
          this.isMaintenanceMode =
            envs.SPA_ENV_FPIR_MAINTENANCE_FLAG.toLowerCase() ===
            MAINT_FLAG_TRUE;
          this.$valueSubject.next(envs);
        }

        resolve(this.isMaintenanceMode);
      });
    });
  }
}
