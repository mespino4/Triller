import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileModalComponent } from '../../../_modals/edit-profile-modal/edit-profile-modal.component';
import { User, Member } from '../../../shared/models.index';
import { MessageService, AccountService, MemberService, 
        PresenceService, BlockService, LanguageService } from '../../../shared/services.index';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent {
  @Input() member: Member | undefined
  isFollow: boolean = true
  isUser: boolean | undefined
  user: User | null = null;
  @Input() isMemberBlocked: boolean | null = null;
  @Input() isUserBlocked: boolean | null = null;

  isOnline: boolean | undefined

  constructor( private memberService: MemberService, private messageService: MessageService,  
    private blockService: BlockService, private toastr: ToastrService, public accountService: AccountService,
    public presenceService: PresenceService, public dialog: MatDialog) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
        
    })
  }

  ngOnInit(): void {
    if(this.member){
      this.conectionStatus(this.member);
      this.online(this.member)
    }

    if(this.member?.username == this.user?.username){
      this.isUser = true
    }else{
      this.isUser = false
    }
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

  ngOnChanges() {
    console.log("is online change", this.isOnline)
  }

  online(member: Member){
    console.log("is online 1", this.isOnline)
    this.presenceService.onlineUsers$.subscribe({
      next: response => console.log("users", response) //this.isOnline = response.includes(member.userName),
      //next: response => this.isOnline = response.includes(member.username),
    })
    
    console.log("is online 2", this.isOnline)
    
  }

  chatButton(username: string) {
    this.messageService.openInbox(username).subscribe({
      next: response => console.log("inbox opened")
    })
  }

  //connections
  conectionStatus(member: Member){
    this.memberService.getConnectionStatus(member.id).subscribe({
      next: response => this.isFollow = response
    })
  }

  follow(member: Member){
    this.memberService.follow(member.id).subscribe({
      next: () => this.toastr.success('You now follow ' + member.displayname)
    })
  }

  unfollow(member: Member){
    this.memberService.unfollow(member.id).subscribe({
      next: () => this.toastr.success('You no longer follow ' + member.displayname)
    })
  }

  //block & unblock
  block(member: Member){
    this.blockService.block(member.id).subscribe({
      next: () => this.toastr.success('You have blocked' + member.displayname)
    })
    if(this.isFollow) this.unfollow(member)
  }

  unblock(member: Member){
    this.blockService.unblock(member.id).subscribe({
      next: () => this.toastr.success('You have unblocked' + member.displayname)
    })
  }

  hasAdminRole(): boolean {
    const user = this.user;
    if (user && user.roles && user.roles.length > 0) {
        return user.roles.includes('Admin');
    }
    return false;
  }
}
