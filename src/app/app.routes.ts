import {Routes} from '@angular/router';
import {MainPage} from "./pages/mainpage/mainpage.component";
import {Register} from "./pages/register/register.component";
import {Login} from "./pages/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {Guestbook} from "./pages/guestbook/guestbook.component";
import {ResetPassword} from "./pages/reset-password/reset-password.component";
import {GuestbookCreateEntry} from "./pages/guestbook-create-entry/guestbook-create-entry.component";
import {AdminDashboard} from "./pages/admin-dashboard/admin-dashboard.component";
import {DashboardGuard} from "./guards/dashboard.guard";

export const routes: Routes = [
  {path: '', component: MainPage, pathMatch: 'full'},
  {path: 'register', component: Register},
  {path: 'login', component: Login},
  {
    path: 'reset-password',
    component: ResetPassword,
    canActivate: [AuthGuard]
  },
  {path: 'guestbook', component: Guestbook},
  {path: 'guestbook/create', component: GuestbookCreateEntry},
  {path: 'guestbook/update', component: GuestbookCreateEntry}, // TODO authguard
  {path: 'dashboard', component: AdminDashboard, canActivate:[DashboardGuard]},

];
