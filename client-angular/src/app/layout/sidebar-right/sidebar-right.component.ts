import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService, MemberService } from '../../shared/services.index';
import { Member, User } from '../../shared/models.index';
import { ExploreUsersModalComponent } from '../../_modals/explore-users-modal/explore-users-modal.component';

@Component({
  selector: 'app-sidebar-right',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './sidebar-right.component.html',
  styleUrl: './sidebar-right.component.css'
})

export class SidebarRightComponent {
  member: Member | undefined;
  user: User | null = null;
  exploreMembers: Member[] | undefined;

  private accountService = inject(AccountService)
  private memberService = inject(MemberService)
  private dialog = inject(MatDialog)
  private cdr = inject(ChangeDetectorRef)
    
  ngOnInit(): void {
    this.initializeUser();
    this.loadUser();
    this.exploreUsers(4)
  }
  
  initializeUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {this.user = user;}
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
      next: (response) => {this.exploreMembers = response},
      error: (error) => {console.error('Explore Users Error:', error);}
    });
  }

  viewExploreUsers() {
    const dialogRef = this.dialog.open(ExploreUsersModalComponent, {
      width: '400px',
    });
  }
}
