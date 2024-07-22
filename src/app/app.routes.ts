import { Routes } from '@angular/router';
import {MainPage} from "./pages/mainpage/mainpage.component";

export const routes: Routes = [
  {path: '', component: MainPage, pathMatch: 'full'},


];
