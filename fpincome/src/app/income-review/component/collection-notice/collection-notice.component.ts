import {
  Component,
  ViewChild,
  Input,
  ElementRef,
  HostListener,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'fpir-collection-notice',
  templateUrl: './collection-notice.component.html',
})
export class CollectionNoticeComponent {
  @Input() isDisabled: boolean = false;
  @Input() buttonLabel: string = 'Continue';

  // Read after the ngAfterViewInit
  @ViewChild('collectionNoticeModal', { static: false })
  public collectionNoticeModal: ModalDirective;

  constructor() {}

  public openModal(): void {
    this.collectionNoticeModal.config.keyboard = false;
    this.collectionNoticeModal.config.focus = true;
    this.collectionNoticeModal.config.ignoreBackdropClick = true;
    this.collectionNoticeModal.config.backdrop = 'static';

    this.collectionNoticeModal.show();
  }

  public closeModal($event): boolean {
    this.collectionNoticeModal.hide();
    $event.stopPropagation();
    return false;
  }
}
