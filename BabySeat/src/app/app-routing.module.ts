import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signin', loadChildren: './signin/signin.module#SigninPageModule' },
  { path: 'selectUser', loadChildren: './select-user/select-user.module#SelectUserPageModule' },
  { path: 'configuration', loadChildren: './configuration/configuration.module#ConfigurationPageModule' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },  { path: 'map-view', loadChildren: './map-view/map-view.module#MapViewPageModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
