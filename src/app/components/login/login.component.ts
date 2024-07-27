import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../services/config.service";
import {Router} from "@angular/router";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  hidePassword = true;
  loginForm!: UntypedFormGroup;

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private configService: ConfigService, private router: Router) {
  }

  ngOnInit() {
     this.loginForm = new UntypedFormGroup({
       usernameOrEmail: new UntypedFormControl('',[]),
       password: new UntypedFormControl('',[]),
     })
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hidePassword = !this.hidePassword;
  }

  updateCheckbox(event: boolean) {
    console.log("Check")
  }

  async login() {

  }

}
