import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { AboutComponent } from './components/about.component';
import { CheckLoginGuard } from './services/profiles.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [CheckLoginGuard] },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ProfilesRoutingModule { }
