import { Routes } from '@angular/router';
import LoginFormComponent from './components/backup/login/login-form.component'
import {ProfilePageComponent} from './components/backup/profile/profile-page.component'
import {ProfileFormComponent} from './components/editprofile/profile-form.component'
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path: "",
        component: LoginComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path:"updateprofile",
        component: ProfileFormComponent
    }
];
