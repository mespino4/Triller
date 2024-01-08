import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { User } from './_models/user';
import { filter, take } from 'rxjs';
import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { SidebarLeftComponent } from './layout/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './layout/sidebar-right/sidebar-right.component';
import { HomeComponent } from './pages/home/home.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { LanguageService } from './_services/language.service';

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

  user: User | null = null;
  showRightSidebar = true;
  currentLanguage: string = 'en'

  constructor(private http: HttpClient, public accountService: AccountService, 
    private router: Router, private languageService: LanguageService) {}

  ngOnInit(): void {
    this.setCurrentUser();
    this.setupRightSidebar()
  }

  setCurrentUser() {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user})

    const userString = localStorage.getItem('user'); // Retrieve the current user information from local storage.
    if (!userString) return;                         // If the user information is not found in local storage, return early.
    const user: User = JSON.parse(userString);       // Parse the user information from a JSON string to a User object.
  
    this.accountService.setCurrentUser(user);        // Set the current user using the AccountService.
    this.getCurrentLanguage()
    this.languageService.initializeTranslation(this.currentLanguage); // Inform the LanguageService about the user's language.
  }

  getCurrentLanguage(): void {
    this.accountService.getLanguage().subscribe({
      next: (response: string) => {this.languageService.setCurrentLanguage(response);},
      error: (error) => {console.error('Error fetching language', error);},
    });
  }

  private setupRightSidebar() {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.showRightSidebar = !!(event as NavigationEnd)
          .urlAfterRedirects?.includes('messages');
      });
  }
}
