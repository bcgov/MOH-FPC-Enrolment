import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Base } from 'moh-common-lib';
import {ImageInterface} from '../../../../models/image-interface';
import { defer, fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'fpcare-sample-modal',
  templateUrl: './sample-modal.component.html',
  styleUrls: ['./sample-modal.component.scss']
})
export class SampleModalComponent extends Base implements OnInit {

  @Input() title: string;
  @Input() images: ImageInterface[];
  @Output() onHide: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('samplesModal', { static: true }) 
  public samplesModal: ModalDirective;
  private onHide$: Subscription;
  private unsubscribe$ = new Subject<void>();

  keyDown$ = defer(() => fromEvent(document, 'keydown')).pipe(
    tap((event: any) => {
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
      const tabElements = this.getElements();

      if (!tabElements.find((x) => x === event.target)) {
        tabElements[0].focus();
        event.preventDefault();
      }
    })
  );

  constructor(private el: ElementRef) {
    super();
  }

  ngOnInit() {
    this.images = [
      {path: 'assets/income_tax_t1_sample.jpeg', desc: 'Income Tax T1 Sample image'},
      {path: 'assets/notice_of_assess_sample.jpeg', desc: 'Notice of Assessment Sample image'}
    ];
  }

  ngAfterViewInit() {
    this.onHide$ = this.samplesModal.onHide.subscribe(() => {
      this.onHide.emit();
    });

    this.keyDown$.pipe(takeUntil(this.unsubscribe$)).subscribe();
    this.onFocusIn$.pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  ngOnDestroy() {
    this.onHide$.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public openModal(): void {
    this.samplesModal.config.keyboard = false;
    this.samplesModal.config.focus = true;
    this.samplesModal.config.ignoreBackdropClick = true;
    this.samplesModal.config.backdrop = 'static';
    this.samplesModal.show();
  }

  public closeModal(): void {
    this.samplesModal.hide();
  }

  getElements(): Array<HTMLElement> {
    const focusElmts =
      'button';

    const _tabElements = Array.prototype.slice.call(
      this.el.nativeElement.querySelectorAll(focusElmts)
    );
    
    return _tabElements;
  }
}
