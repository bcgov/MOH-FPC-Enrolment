import {
  ContainerService,
  AbstractReactForm,
  PageStateService,
} from 'moh-common-lib-angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Directive, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

// Angular requires an explicit decorator on a base class that uses Angular
// features (DI, lifecycle hooks) and is extended by @Component classes.
@Directive()
export class BaseForm extends AbstractReactForm
  implements OnInit, AfterViewInit, OnDestroy {
  private _subscription: Subscription;

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService
  ) {
    super(router);
  }

  ngOnInit() {
    // Default behaviour for most pages - override if need different functionality
    this.containerService.setSubmitLabel();
    this.containerService.setUseDefaultColor();

    // Set page incomplete
    this.pageStateService.setPageIncomplete();
  }

  ngAfterViewInit() {
    this._subscription = this.containerService.$continueBtn.subscribe(() => {
      this.continue();
    });

    // Set focus to main html tag identified by id=content
    const mainContent = document.getElementById('content');
    // Headless tests fail if null not checked for
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  continue() {
    // console.log( 'Continue: base form to be overriden');
  }

  protected navigate(url: string) {
    // Set page complete before navigating to next URL
    this.pageStateService.setPageComplete();
    super.navigate(url);
  }
}
