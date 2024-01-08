import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { adminGuard } from './_guards/admin.guard';
import { memberProfileResolver } from './_resolvers/member-profile.resolver';
import { HomeComponent, AuthenticationComponent, ProfileComponent, 
        NotificationsComponent, MessagesComponent, BookmarksComponent, 
        ConnectionsComponent, AdminComponent, SettingsComponent, TrillComponent } 
        from './shared/pages.index';

export const routes: Routes = [
  {path: '', component: AuthenticationComponent},
  //{path: 'register', component: RegisterComponent},
  
  {path: '', 
    runGuardsAndResolvers: 'always',
    //canActivate: [authGuard],
    children: [
      {path: 'login', component: AuthenticationComponent},
      //{path: 'register', component: RegisterComponent},
      {path: 'home', component: HomeComponent},
      {path: 'profile/:username', component: ProfileComponent, resolve: {member: memberProfileResolver}},
      {path: 'notifications', component: NotificationsComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'messages/:username', component: MessagesComponent},
      {path: 'bookmarks', component: BookmarksComponent},
      {path: 'connections', component: ConnectionsComponent},
      {path: 'admin', component: AdminComponent, canActivate: [adminGuard]},
      {path: 'settings', component: SettingsComponent},
      {path: 'trill/:trillId', component: TrillComponent},
    ]
  },

  /*
  {path: 'errors', component: TestErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'}
  */
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }