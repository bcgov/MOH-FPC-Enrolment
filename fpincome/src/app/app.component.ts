import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';

import { CommonLogEvents } from 'moh-common-lib';

import { APP_TITLE, TAB_APP_TITLE } from './app.constants';
import { SplunkLoggingService } from './services/splunk-logging.service';
import { SplashPageService } from './services/splash-page.service';
import * as version from '../version.GENERATED';

@Component({
  selector: 'fpir-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  appTitle = APP_TITLE;

  constructor(
    private titleService: Title,
    private router: Router,
    private splunkLogging: SplunkLoggingService,
    private activatedRoute: ActivatedRoute,
    private splashPageService: SplashPageService
  ) {
    version.success
      ? console.log(
          '%c' + version.message,
          'color: #036; font-size: 20px; background-color: white;'
        )
      : console.error(version.message);
  }

  ngOnInit() {
    this.splashPageService.setup();
    this.updateTitleOnRouteChange();
  }

  /** Set the page title. Includes basic formatting and fallback */
  private setTitle(title?: string) {
    let tabTitle = TAB_APP_TITLE;

    if (title) {
      const _title = title
        .split('-')
        .map((x) => x[0].toUpperCase() + x.slice(1))
        .join(' ');
      tabTitle = tabTitle.concat(' - ' + _title);
    }

    // If title is null, use default title
    this.titleService.setTitle(tabTitle);
  }

  /**
   * Listen to every route change, and update the page title based on the
   * 'title' property in the route's data.
   */
  private updateTitleOnRouteChange() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data: { title?: string }) => {
        this.setTitle(data.title);
        this.splunkLogging.log({
          event: CommonLogEvents.navigation,
          title: data.title ? data.title : this.appTitle,
          url: this.router.url,
        });
      });
  }
}
