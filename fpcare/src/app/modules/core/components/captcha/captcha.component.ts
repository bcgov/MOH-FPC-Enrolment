import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'common-captcha',
  template: '<small class="text-muted">[Captcha bypassed in dev]</small>',
})
export class FpcareCaptchaComponent implements OnInit {
  @Input() apiBaseUrl: string;
  @Input() nonce: string;
  @Input() successMessage: string;
  @Output() onValidToken = new EventEmitter<string>();

  ngOnInit() {
    // Emit a stub token immediately so the consent modal can proceed in dev
    setTimeout(() => this.onValidToken.emit('dev-stub-token'), 0);
  }
}
