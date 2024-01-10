import { ChangeDetectorRef, Component } from '@angular/core';
import { AccountService, LanguageService, MemberService } from '../../shared/services.index';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Member, User } from '../../shared/models.index';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar-right',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sidebar-right.component.html',
  styleUrl: './sidebar-right.component.css'
})
export class SidebarRightComponent {
  member: Member | undefined;
  user: User | null = null;
  exploreMembers: Member[] | undefined;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private memberService: MemberService,
    public dialog: MatDialog, private cdr: ChangeDetectorRef,
    private languageService: LanguageService) {}
    
    ngOnInit(): void {
      this.initializeUser();
      this.loadUser();
      this.exploreUsers(4)
    }
  
  initializeUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        this.user = user;
      }
    });
  }
  
  loadUser(): void {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    });
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  exploreUsers(numOfUsers: number): void {
    this.memberService.exploreUsers(numOfUsers).subscribe({
      next: (response) => {console.log('Explore Users Response:', response);
      this.exploreMembers = response
    },
      error: (error) => {console.error('Explore Users Error:', error);}
    });
  }

}
