import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Member } from '../../shared/models.index';
import { LanguageService, MemberService } from '../../shared/services.index';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-explore-users-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterModule],
  templateUrl: './explore-users-modal.component.html',
  styleUrl: './explore-users-modal.component.css'
})

export class ExploreUsersModalComponent {
  members: Member[] | undefined;
  isFollow: boolean | null = null;
  connectionMap: Map<number, boolean> = new Map<number, boolean>();

  private memberService = inject(MemberService)
  public dialogRef = inject(MatDialogRef<ExploreUsersModalComponent>)
  public toastr = inject(ToastrService)
  private router = inject(Router)
  
  ngOnInit(){
    this.loadMembers()

    if (this.members) {
      this.members.forEach((member) => {
        this.getConnectionStatus(member.id).subscribe((isBlocked: boolean) => {
          this.connectionMap.set(member.id, isBlocked);
        });
      });
    }
  }

  getConnectionStatus(memberId: number): Observable<boolean> {
    return this.memberService.getConnectionStatus(memberId);
  }

  toggleConnectionStatus(member: Member) {
    this.getConnectionStatus(member.id).subscribe((isFollow: boolean) => {
      if (isFollow) {
        this.unfollow(member);
      } else {
        this.follow(member);
      }
    });
  }

  ok(){
    this.dialogRef.close(true);
  }

  navigateToProfile(username: string) {
    this.dialogRef.close();
    // Navigate to the profile page
    this.router.navigate(['/profile', username]);
  }

  loadMembers() {
    this.memberService.exploreUsers(8).subscribe({
      next: (response) => {this.members = response;},
      error: (error) => {
        console.error('Explore Users Error:', error);
      }
    });
  }

  follow(member: Member): void {
    this.memberService.follow(member.id).subscribe(({
      next: () => this.toastr.success(`You now follow ${member.displayname}`)
    }));
    this.connectionMap.set(member.id, true)
  }

  unfollow(member: Member): void {
    this.memberService.unfollow(member.id).subscribe({
      next: () => this.toastr.success(`You no longer follow ${member.displayname}`)
    });
    this.connectionMap.set(member.id, false)
  }
}
