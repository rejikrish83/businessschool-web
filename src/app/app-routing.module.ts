import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [{ path: 'login/callback', component: OktaCallbackComponent },
{ path: 'login', component: LoginComponent },
{ path: 'profile', component: ProfileComponent, canActivate: [OktaAuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
