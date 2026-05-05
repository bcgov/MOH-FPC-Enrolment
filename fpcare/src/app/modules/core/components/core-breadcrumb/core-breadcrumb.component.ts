import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'common-core-breadcrumb',
  template: '<nav class="common-core-breadcrumb"><ng-content></ng-content></nav>',
})
export class FpcareCoreBreadcrumbComponent {}
