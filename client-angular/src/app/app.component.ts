import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { User } from './_models/user';
import { filter, take } from 'rxjs';
import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Member } from './_models/member';
import { SidebarLeftComponent } from './layout/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './layout/sidebar-right/sidebar-right.component';
import { HomeComponent } from './pages/home/home.component';
import { NgxSpinnerModule } from "ngx-spinner";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarLeftComponent, SidebarRightComponent, HomeComponent,
    NgxSpinnerModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client-angular';
  users: any;
  user: User | null = null;

  followers: Member[] = []; // Define an array to store followers
  following: Member[] = []; // Define an array to store following
  idArray: any;

  showRightSidebar = true;

  constructor(private http: HttpClient, public accountService: AccountService, 
    //private memberService: MembersService, 
    private router: Router) {
  
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })

    this.router.events.pipe(filter((event):event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.showRightSidebar = !!(event as NavigationEnd)
          .urlAfterRedirects?.includes('messages');
      }
    );
  }

  ngOnInit(): void {
    this.setCurrentUser();
    //this.getFollowing();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');// Retrieve the current user information from local storage.
    if (!userString) return;                        // If the user information is not found in local storage, return early.
    const user: User = JSON.parse(userString);      // Parse the user information from a JSON string to a User object.

    this.accountService.setCurrentUser(user);       // Set the current user using the AccountService.
  }

  /*
  getFollow(){
    this.memberService.getConnections('followers').subscribe({
      next: response =>  {
        this.followers = response
        //this.accountService.followers = response
      }
    })

    this.memberService.getConnections('following').subscribe({
      next: response =>  {
        this.following = response
      }
    })

    //this.accountService.followers = this.followers
  }

  getFollowing(){
    this.memberService.getConnections('following').subscribe({
      next: response =>  {
        //console.log('this is the response', response)
        //this.following = response

        //console.log('from app ' ,[response][1])
        if(Array.isArray(response) && response.length > 0){
          this.accountService.following = response.map(item => item.id)
        }
        //console.log('this is following from account', this.accountService.following)
      }
    });
  }
*/
  
}
