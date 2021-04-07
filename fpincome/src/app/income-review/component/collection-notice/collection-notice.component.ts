import {
  Component,
  ViewChild,
  Input,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { defer, fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'fpir-collection-notice',
  templateUrl: './collection-notice.component.html',
})
export class CollectionNoticeComponent implements AfterViewInit, OnDestroy {
  @Input() isDisabled: boolean = false;
  @Input() buttonLabel: string = 'Continue';
  @Output() onHide: EventEmitter<void> = new EventEmitter<void>();

  // Read after the ngAfterViewInit
  @ViewChild('collectionNoticeModal', { static: false })
  public collectionNoticeModal: ModalDirective;

  private onHide$: Subscription;
  private onShow$: Subscription;
  private unsubscribe$ = new Subject<void>();

  keyDown$ = defer(() => fromEvent(document, 'keydown')).pipe(
    tap((event: any) => {
      // console.log('keyDown: ', event.target );
      const tabElements = this.getElements();

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (tabElements.length > 0 && tabElements[0] === event.target) {
            tabElements[tabElements.length - 1].focus();
            event.preventDefault();
          }
        } else {
          if (
            tabElements.length > 0 &&
            tabElements[tabElements.length - 1] == event.target
          ) {
            tabElements[0].focus();
            event.preventDefault();
          }
        }
      }
    })
  );

  onFocusIn$ = defer(() => fromEvent(document, 'focusin')).pipe(
    tap((event: any) => {
      // console.log('document focus in: ', event.target);
      const tabElements = this.getElements();

      if (!tabElements.find((x) => x === event.target)) {
        tabElements[0].focus();
        event.preventDefault();
      }
    })
  );
  /*
  onFocusOut$ = defer(() => fromEvent(document, 'focusout')).pipe(
    tap((event: any) => {
      console.log('document focus out: ', event.target);
      const _tabElements = this.getElements();
    })
  ); */

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // console.log('el: ', this.el);
    this.onHide$ = this.collectionNoticeModal.onHide.subscribe(() => {
      this.onHide.emit();
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    });

    this.onShow$ = this.collectionNoticeModal.onShow.subscribe(() => {
      this.keyDown$.pipe(takeUntil(this.unsubscribe$)).subscribe();
      this.onFocusIn$.pipe(takeUntil(this.unsubscribe$)).subscribe();
      // this.onFocusOut$.pipe(takeUntil(this.unsubscribe$)).subscribe();
    });
  }

  ngOnDestroy() {
    this.onHide$.unsubscribe();
    this.onShow$.unsubscribe();
  }

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

  getElements(): Array<HTMLElement> {
    const focusElmts =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])';

    const _tabElements = Array.prototype.slice.call(
      this.el.nativeElement.querySelectorAll(focusElmts)
    );

    // console.log( 'tab elements: ', _tabElements);
    return _tabElements;
  }
}
