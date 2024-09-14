// confirm-password.validator.ts

import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;  // Return null if form controls are missing
  }

  // Return an error if passwords do not match
  return password.value !== confirmPassword.value ? {passwordsMismatch: true} : null;
};
