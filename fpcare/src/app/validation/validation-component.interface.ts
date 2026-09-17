import { ElementRef } from '@angular/core';

export interface ValidationComponent {
  fieldName?: string;
  ERROR_STRING?: string;
  validate: (input: ElementRef) => boolean;
}

/**
 * Similar to the `implements` keyword, but also works for static functions.
 * Necessary to use with ValidationComponent, as `validate` is static.
 * The parameter is unused at runtime; it exists only so TypeScript checks the
 * decorated class against T.
 */
export function staticImplements<T>() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  return (_constructor: T) => {};
}
