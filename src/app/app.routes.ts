import {Routes} from '@angular/router';
import {MainPage} from "./pages/mainpage/mainpage.component";
import {Register} from "./pages/register/register.component";
import {Login} from "./pages/login/login.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {path: '', component: MainPage, pathMatch: 'full'},
  {path: 'register', component: Register},
  {path: 'login', component: Login},
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [AuthGuard]
  }

];
