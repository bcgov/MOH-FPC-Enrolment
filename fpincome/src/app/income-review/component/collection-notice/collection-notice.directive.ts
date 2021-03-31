import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';
import { defer, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

/** Used FPCare Public Web as guide for directive to keep focus within modal */
@Directive({
  selector: '[fpirCollectionNotice]',
  exportAs: 'modalFocusReference',
})
export class CollectionNoticeDirective implements OnInit, AfterViewInit {
  keyDown$ = defer(() => fromEvent(document, 'keydown')).pipe(
    tap((event: any) => {
      // console.log('keyDown: ', event.target );
      const _enabled = this.getElements().filter(
        (x) => !x.hasAttribute('disabled')
      );

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          // console.log('tab with shift key: ');
          if (
            event.target.hasAttribute('tabIndex') &&
            event.target.tabIndex === 1
          ) {
            _enabled[_enabled.length - 1].focus();
            event.preventDefault();
          }
        }
      }
    })
  );

  onFocusIn$ = defer(() => fromEvent(document, 'focusin')).pipe(
    tap((event: any) => {
      // console.log('document focus in: ', event.target);
      const _tabElements = this.getElements();

      if (!_tabElements.find((x) => x === event.target)) {
        const _enabled = _tabElements.filter(
          (x) => !x.hasAttribute('disabled')
        );
        _enabled[0].focus();
        event.preventDefault();
      }
    })
  );

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.keyDown$.subscribe();
    this.onFocusIn$.subscribe();
  }

  /**
   * TODO: Partially working - need a way to set focus on the 'continue' button and
   * determine whether items have been hidden in the modal-body (i.e. hidden or invisible)
   */
  ngAfterViewInit(): void {
    this.getElements();
  }

  getElements(): Array<HTMLInputElement> {
    const focusElmts = 'a, button, input';

    const _modalElmt = this.el.nativeElement.querySelector('.modal-dialog');
    const _tabElements = Array.prototype.slice.call(
      _modalElmt.querySelectorAll(focusElmts)
    );

    _tabElements.forEach((x, idx) => {
      x.tabIndex = idx + 1;
    });

    // console.log( 'tab elements: ', _tabElements);
    return _tabElements;
  }
}
