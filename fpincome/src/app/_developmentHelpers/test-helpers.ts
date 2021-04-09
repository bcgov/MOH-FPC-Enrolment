import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';

export const partialRequiredMsg = 'is required';

export function getDebugInlineError(de: DebugElement) {
  const _de = de.nativeElement.querySelector('common-error-container');
  // console.log( '_de: ', _de );
  return _de ? _de.textContent : null;
}

export function getDebugElement(
  fixture: ComponentFixture<any>,
  componentHtml: string,
  name: string = null
) {
  const _selector = name
    ? componentHtml + '[name=' + name + ']'
    : componentHtml;
  let _de = fixture.debugElement.query(By.css(_selector));

  if (!_de) {
    // Reactive form element
    _de = fixture.debugElement.query(
      By.css(componentHtml + '[formControlName=' + name + ']')
    );
  }
  return _de;
}

export function getAllDebugElements(
  fixture: ComponentFixture<any>,
  componentHtml: string
) {
  return fixture.debugElement.queryAll(By.css(componentHtml));
}

export function setInput(de: DebugElement, name: string, value: any) {
  let _de = de.nativeElement.querySelector('input[name=' + name + ']');
  if (!_de) {
    // Inputs that use 'value' instead of 'ngModel'
    _de = de.nativeElement.querySelector('input[id=' + name + ']');
    if (!_de) {
      // Reactive form inputs
      _de = de.nativeElement.querySelector(
        'input[formControlName=' + name + ']'
      );
    }
  }
  _de.focus();
  _de.value = value;
  _de.dispatchEvent(new Event('input'));
  _de.dispatchEvent(new Event('change'));
  _de.dispatchEvent(new Event('blur'));
}

export function clickRadioButton(de: DebugElement, value: string) {
  const _de = de.query(By.css('input[value=' + value + ']'));
  _de.nativeElement.click();
}

export function getRadioErrorMsg(
  fixture: ComponentFixture<any>,
  btnName: string
) {
  const btn = getDebugElement(fixture, 'common-radio', btnName);
  return getDebugInlineError(btn);
}

export function getErrorMsg(fixture: ComponentFixture<any>, pos) {
  const formError = getAllDebugElements(
    fixture,
    'form common-error-container .error--container'
  );
  return formError[pos].nativeElement.textContent;
}

export function getRadioBtnLabel(de: DebugElement, value: any) {
  const _input = de.query(By.css('input[value="' + value + '"]'));
  if (_input) {
    const _label = de.query(
      By.css('label[for="' + _input.nativeElement.id + '"] ')
    );
    return _label ? String(_label.nativeElement.textContent).trim() : null;
  }
  return null;
}

export function getCheckedValue(de: DebugElement) {
  const _de = de.query(By.css('input[type=radio]:checked'));
  return _de ? _de.nativeElement.value : null;
}

export function clickValue(de: DebugElement, value: any) {
  const _de = de.query(By.css('input[value="' + value + '"]'));
  if (_de) {
    _de.nativeElement.click();
  }
}

export class MockRouter {
  url = '/';

  navigate(commands: any[], extra?: NavigationExtras): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.url = commands[0];
      return resolve(true);
    }).then((res) => res);
  }
}
