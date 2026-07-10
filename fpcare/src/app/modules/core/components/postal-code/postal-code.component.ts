import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Stub replacing the old common-postal-code from moh-common-lib-angular.
 * Implements ControlValueAccessor so ngModel bindings work in template-driven forms.
 */
@Component({
  standalone: false,
  selector: 'common-postal-code',
  template: `
    <div class="form-group">
      <label *ngIf="label">{{label}}</label>
      <input class="form-control"
             type="text"
             mask="S0S 0S0"
             [dropSpecialCharacters]="false"
             [value]="innerValue"
             [disabled]="disabled"
             [required]="required"
             (input)="onInput($event)"
             (blur)="onBlur()">
      <div *ngIf="touched && required && !innerValue" class="invalid-feedback d-block">
        {{label}} is required
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FpcarePostalCodeComponent),
      multi: true,
    },
  ],
})
export class FpcarePostalCodeComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() bcOnly = false;

  innerValue = '';
  touched = false;

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.innerValue = val || '';
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    this.innerValue = (event.target as HTMLInputElement).value;
    this.onChange(this.innerValue);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }
}
