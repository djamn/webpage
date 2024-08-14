import {FormGroup} from "@angular/forms";

export function isControlInvalid(form: FormGroup, controlName: string): boolean {
  const control = form.get(controlName)!;
  return control && control.invalid && (control.dirty || control.touched);
}
