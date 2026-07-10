import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: false,
  selector: 'common-page-framework',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    common-page-framework {
      background: #fcfcfc;
      display: block;
      padding-left: 30px;
      padding-right: 30px;
      min-height: calc(100vh - 280px);
    }
    common-page-framework common-form-action-bar > .form-bar,
    common-page-framework common-form-submit-bar > .form-bar {
      background-color: red !important;
    }
    common-page-framework common-form-action-bar .btn,
    common-page-framework common-form-submit-bar .btn {
      font-size: 0;
    }
    common-page-framework common-form-action-bar .btn:after,
    common-page-framework common-form-submit-bar .btn:after {
      font-size: 1rem;
      content: "FORM BAR MUST BE PLACED OUTSIDE OF COMMON-PAGE-FRAMEWORK";
    }
    .aside-col aside {
      background: #f2f2f2;
      padding: 1em;
      border-radius: 5px;
    }
    @media (min-width: 768px) {
      .aside-col aside {
        margin-top: 1rem;
      }
    }
  `],
  template: `
    <div [class.row]="isDefault">
      <div [class.col-md-8]="isDefault">
        <div class="px-lg-4 px-md-3 py-3">
          <ng-content></ng-content>
        </div>
      </div>
      <div [class.col-md-4]="isDefault" [class.aside-col]="isDefault">
        <div class="pr-lg-5 pr-md-4 py-2">
          <ng-content select="aside"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class FpcareCommonPageFrameworkComponent {
  @Input() layout: string = 'default';

  get isDefault(): boolean {
    return this.layout === 'default';
  }
}
