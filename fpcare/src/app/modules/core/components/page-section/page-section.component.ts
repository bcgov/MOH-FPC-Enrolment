import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'common-page-section',
  template: '<div class="common-page-section"><ng-content></ng-content></div>',
})
export class FpcarePageSectionComponent {
  @Input() layout: string;
}
