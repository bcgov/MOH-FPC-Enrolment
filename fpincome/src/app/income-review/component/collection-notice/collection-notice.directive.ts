import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

/** Used FPCare Public Web as guide for directive to keep focus within modal */
@Directive({
  selector: '[fpirCollectionNotice]',
  exportAs: 'modalFocusReference',
})
export class CollectionNoticeDirective implements AfterViewInit, OnDestroy {
  _tabElements: Array<HTMLInputElement>;
  _allElements: Array<HTMLInputElement>;

  _currentFocus: HTMLInputElement;
  _observer: MutationObserver;

  constructor(private el: ElementRef) {}

  /**
   * TODO: Partially working - need a way to set focus on the 'continue' button and
   * determine whether items have been hidden in the modal-body (i.e. hidden or invisible)
   */
  ngAfterViewInit(): void {
    // console.log('afterViewInit');
    this.getElements();

    const config = { attributes: true, childLlist: true, subtree: true };
    this._observer = new MutationObserver((mutations) => {
      // Refresh list
      this.getElements();

      // console.log('mutations: ', mutations, this._tabElements);
    });

    this._observer.observe(this.el.nativeElement, config);
  }

  ngOnDestroy(): void {
    this._observer.disconnect();
  }

  getElements(): void {
    this._allElements = Array.prototype.slice.call(
      this.el.nativeElement.querySelectorAll('.modal-content *')
    );
    this._tabElements = this._allElements.filter(
      (element) =>
        element.nodeName === 'INPUT' ||
        element.nodeName === 'BUTTON' ||
        element.nodeName === 'SELECT' ||
        element.nodeName === 'A'
    );
  }

  /*
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log( 'keyboard event: ', event);


    if (event.key !== 'Tab') {
       // const firstEnableElmt = this._tabElements.find(x => !x.hasAttribute('disabled'));

      const activeElement = document.activeElement;
      console.log( 'active, current: ', activeElement, this._currentFocus.parentElement);
      if (!this._currentFocus.isEqualNode(activeElement)) {
        console.log('active element does not equal current focus - need new focus');
      }

          // Not found in modal elements
      if (!this._tabElements.find( x => x === event.target)) {
        console.log( 'not in tab list: ', activeElement, this._tabElements);
      }


    }
  }
*/
  @HostListener('document:focusin', ['$event'])
  onFocusIn(event: FocusEvent) {
    // Not found in modal elements
    if (!this._allElements.find((x) => x === event.target)) {
      // console.log('focus: element not found in list - ', event.target);

      // Set to the first tabbable element
      this._currentFocus = this._currentFocus = this._tabElements.find(
        (x) => !x.disabled
      );

      // Set focus
      this._currentFocus.focus();
      event.preventDefault();
    } else {
      // console.log('focus element - ', event.target);
      this._currentFocus = event.target as HTMLInputElement;
    }
  }
}
