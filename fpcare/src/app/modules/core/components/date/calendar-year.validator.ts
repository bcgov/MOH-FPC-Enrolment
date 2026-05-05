import {Directive, forwardRef, Input} from '@angular/core';
import {Validator, NG_VALIDATORS, FormControl} from '@angular/forms';

@Directive({
  standalone: false,
  selector: '[validateCalendarYear][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CalendarYearValidatorDirective), multi: true
    }
  ]
})
export class CalendarYearValidatorDirective {

  validate(control: FormControl): {[key: string]: boolean; }  {
    // console.log('year value at validator: ' + control.value);
    // Get value out of control
    let year: number = control.value;

    if (!year) return;

    // It's possible that the value passed will be 5 digits long.
    // CalendarFieldFormatterDirective will trim it down to 4 characters for the
    // user, however it's impossible to guarantee the order of directives.
    // Consequently, we must explicitly trim a 5rd character if it exists.

    if (year.toString().length > 4){
      year = parseInt( year.toString().slice(0, 4), 10);
    }

    if ( new Date().getFullYear() - year > 150){
      return {'yearDistantPast': true};
    }
    if ( year - new Date().getFullYear() > 150){
      return {'yearDistantFuture': true};
    }

    return null;
  }

}
