import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'fpir-financial-input',
  templateUrl: './financial-input.component.html',
  styleUrls: ['./financial-input.component.scss'],
  host: {
    '(change)': '_onChange($event.target.value)',
    '(blur)': '_onTouched()',
  },
})
export class FinancialInputComponent implements OnInit, ControlValueAccessor {
  @Input() disabled = false;
  // ngx-mask 'separator.0' separatorLimit value (max value, e.g. '999999')
  @Input() moneyMask: string = null;
  @Input() tabIndex: number;

  // Not used as form - used to display
  @Input()
  set value(val: number) {
    this._value = val;
  }
  get value() {
    return this._value;
  }
  @Input()
  set id(val: string) {
    this._name = val;
  }

  readonly _id = Math.ceil(Math.random() * 99999).toString();
  readonly _prefix = 'finance-';

  _value: number = null;
  _name: string;

  // Required for implementing ControlValueAccessor
  // The template calls _onChange with the input value, so the parameter stays
  // in the signature; it is unused until registerOnChange supplies the real handler.
  _onChange = (value: any) => {
    void value;
  };
  _onTouched = () => {
    // No-op default until registerOnTouched supplies the real handler.
  };

  constructor(@Optional() @Self() public control: NgControl) {
    if (this.control !== null) {
      this.control.valueAccessor = this;
    }
  }

  get isErrors() {
    return (
      this.control !== null &&
      !this.control.disabled &&
      this.control.errors &&
      (this.control.touched || this.control.dirty)
    );
  }

  ngOnInit() {
    // Retreive name of the control
    this._name = this.control
      ? String(this.control.name)
      : this._prefix + this._id;
  }

  // Required for implementing ControlValueAccessor
  writeValue(value: any): void {
    this._value = value === undefined ? null : value;
  }

  // Register change function
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  // Register touched function
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  // Disable control
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
