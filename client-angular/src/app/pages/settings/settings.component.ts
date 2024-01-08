import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Member, User } from '../../shared/models.index';
import { EditProfileModalComponent } from '../../_modals/edit-profile-modal/edit-profile-modal.component';
import { NoticeModalComponent } from '../../_modals/notice-modal/notice-modal.component';
import { ViewBlockedUsersComponent } from '../../_modals/view-blocked-users/view-blocked-users.component';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService, MemberService, BlockService, LanguageService } from '../../shared/services.index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  user: User | null = null;
  member: Member | null = null;
  blockedMembers: Member[] | undefined;

  selectedLanguage: string = this.languageService.getCurrentLanguage();

  constructor( private memberService: MemberService, private blockService: BlockService, private router: Router,
    private toastr: ToastrService, public accountService: AccountService, private languageService: LanguageService,
     public dialog: MatDialog) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
      })
  }

  ngOnInit(){
    if(this.user)
    this.memberService.getMember(this.user?.username).subscribe({
      next: member => this.member = member
    })
  }

  editProfile(member: Member) {
    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '400px',
      data: { member: member } // Pass the member data here
    });
  
    // Call the showModal method when the dialog is opened
    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance;
    });
  }

  toggleLanguage(isEnglish: boolean, language: string) {
    this.accountService.setLanguage(isEnglish).subscribe({
      next: (response: any) => {
        console.log('Language toggled successfully', response);
        this.languageService.initializeTranslation(language);
      },
      error: (error: any) => {console.error('Error toggling language', error);}
    });
  }

  viewBlockedUsers() {
    this.blockService.getBlockedUsers().subscribe({
      next: (blockedMembers: Member[]) => {
        this.blockedMembers = blockedMembers;
      },
      error: (error) => {
        console.error('Error fetching blocked members:', error);
      },
      complete: () => {
        const dialogRef = this.dialog.open(ViewBlockedUsersComponent, {
          width: '400px',
          data: { members: this.blockedMembers } // Pass the member data here
        });
      }
    });
  }

  notice(msg: string) {
    const dialogRef = this.dialog.open(NoticeModalComponent, {
      width: '400px',
      data: { message: msg }
    });
  }

  deleteAccount(userId: number) {
    this.accountService.deleteAccount(userId).subscribe({
      next: () => {console.log('Account deleted successfully.');},
      error: (error) => {console.error('Error deleting account:', error);},
      complete: () => {
        console.log('Deletion process completed.');
        this.router.navigateByUrl('/login');
      },
    });
  }

}
