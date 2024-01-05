import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService, MemberService, BlockService } from '../../shared/services.index';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { Member, User } from '../../shared/models.index';
import { EditProfileModalComponent } from '../../_modals/edit-profile-modal/edit-profile-modal.component';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  user: User | null = null;
  member: Member | null = null;

  selectedLanguage: 'english' | 'spanish' = 'english';

  constructor( private memberService: MemberService, 
    private blockService: BlockService, private toastr: ToastrService, public accountService: AccountService,
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

}
