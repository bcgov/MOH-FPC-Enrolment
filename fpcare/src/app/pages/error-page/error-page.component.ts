import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ErrorPageService} from './error-page.service';
import {DisplayIcon} from '../../modules/core/components/results-framework/results-framework.component';

@Component({
  selector: 'fpcare-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  /** Focuses the next element to the heading of a new page */
  @ViewChild('heading', { static: true }) heading: ElementRef<HTMLInputElement>;

  constructor(private errorPageService: ErrorPageService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.heading.nativeElement.focus();
  }

  get errorResponse() {
    return this.errorPageService.errorResponse;
  }

  getErrorIcon(): number {
    return DisplayIcon.ERROR;
  }
}
