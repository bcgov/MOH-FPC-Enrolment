import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface ReviewSectionItemType {
  label: string;
  value: string;
  extraInfo?: string | { [key: string]: any } | null;
}
export interface ReviewObject {
  heading: string;
  isPrintView: boolean;
  sectionItems: ReviewSectionItemType[];
  isFinancialData?: boolean;
  redirectPath?: string;
}

@Component({
  selector: 'fpir-review-container',
  templateUrl: './review-container.component.html',
  styleUrls: ['./review-container.component.scss'],
})
export class ReviewContainerComponent {
  @Input() reviewObject: ReviewObject;

  constructor(private router: Router) {}

  redirectURL() {
    // Redirect only if path exists
    if (this.reviewObject.redirectPath) {
      this.router.navigate([this.reviewObject.redirectPath]);
    }
  }
}
