import {FormGroup} from "@angular/forms";

export function isControlInvalid(form: FormGroup, controlName: string): boolean {
  const control = form.get(controlName);
  const formErrors = form.errors;

  const isControlError = control && control.invalid && (control.dirty || control.touched);

  // Check if the form has any group-level validation errors (e.g., password mismatch)
  const isFormError = formErrors && formErrors['passwordsMismatch'];

  return isControlError || (controlName === 'confirmPassword' && isFormError);
}
