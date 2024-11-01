import {Routes} from '@angular/router';
import {MainPage} from "./pages/mainpage/mainpage.component";
import {Register} from "./pages/register/register.component";
import {Login} from "./pages/login/login.component";
import {UserGuard} from "./guards/user.guard";
import {Guestbook} from "./pages/guestbook/guestbook.component";
import {ResetPassword} from "./pages/reset-password/reset-password.component";
import {AdminDashboard} from "./pages/admin-dashboard/admin-dashboard.component";
import {DashboardGuard} from "./guards/dashboard.guard";
import {Changelog} from "./pages/changelog/changelog.component";
import {AuthGuard} from "./guards/auth.guard";
import {Projects} from "./pages/projects/projects.component";
import {CatCheck} from "./pages/cat-check/cat-check.component";
import {CheckerGuard} from "./guards/checker.guard";

export const routes: Routes = [
  {path: '', component: MainPage, pathMatch: 'full'},
  {path: 'register', component: Register, canActivate: [AuthGuard]},
  {path: 'login', component: Login, canActivate: [AuthGuard]},
  {
    path: 'reset-password',
    component: ResetPassword,
    canActivate: [UserGuard]
  },
  {path: 'projects', component: Projects},
  {path: 'guestbook', component: Guestbook},
  {path: 'changelog', component: Changelog},
  {path: 'cat-check', component: CatCheck, canActivate: [CheckerGuard]},
  {path: 'dashboard', component: AdminDashboard, canActivate: [DashboardGuard]},

];
