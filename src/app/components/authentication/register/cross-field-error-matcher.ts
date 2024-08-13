import {FormGroupDirective, NgForm, UntypedFormControl} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

/** Error when the parent form group is invalid and the control is dirty */
export class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control?.dirty &&
      form?.invalid &&
      form?.hasError('passwordMismatch')
    );
  }
}
