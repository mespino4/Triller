import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { BookmarksComponent } from './pages/bookmarks/bookmarks.component';
import { ConnectionsComponent } from './pages/connections/connections.component';
import { AdminComponent } from './pages/admin/admin.component';
import { adminGuard } from './_guards/admin.guard';

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
      {path: 'profile/:username', component: ProfileComponent},
      {path: 'notifications', component: NotificationsComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'bookmarks', component: BookmarksComponent},
      {path: 'connections', component: ConnectionsComponent},
      {path: 'admin', component: AdminComponent, canActivate: [adminGuard]},
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