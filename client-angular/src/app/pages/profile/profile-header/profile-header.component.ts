import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
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
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent {
  @Input() member: Member | undefined
  isFollow: boolean | null = null;
  isUser: boolean | undefined
  user: User | null = null;
  @Input() isMemberBlocked: boolean | null = null;
  @Input() isUserBlocked: boolean | null = null;
  
  //@Output() blockStatusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  isOnline: boolean | undefined

  constructor( private memberService: MemberService, private messageService: MessageService,  
    private blockService: BlockService, private toastr: ToastrService, public accountService: AccountService,
    public presenceService: PresenceService, public dialog: MatDialog) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => {this.user = user;}
      });
  }

  ngOnInit(): void {
    if (this.member) {
      this.online(this.member);
      this.conectionStatus(this.member);
    }

    if (this.member?.username == this.user?.username) 
      this.isUser = true;
    else this.isUser = false;
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

  online(member: Member){
    console.log("is online 1", this.isOnline)
    this.presenceService.onlineUsers$.subscribe({
      next: response => console.log("users", response) //this.isOnline = response.includes(member.userName),
      //next: response => this.isOnline = response.includes(member.username),
    })
  }

  chatButton(username: string) {
    this.messageService.openInbox(username).subscribe({
      next: response => console.log("inbox opened")
    })
  }

  //connections
  private conectionStatus(member: Member): void {
    this.memberService.getConnectionStatus(member.id).subscribe({
      next: (response) => { this.isFollow = response},
      error: (error) => {
        console.error('Error fetching blocked members:', error);},
      complete: () => {
        console.log("this is the folow ", this.isFollow)
      }
    });
  }

  follow(member: Member){
    this.memberService.follow(member.id).subscribe({
      next: () => this.toastr.success('You now follow ' + member.displayname)
    })
    this.isFollow = true
  }

  unfollow(member: Member){
    this.memberService.unfollow(member.id).subscribe({
      next: () => this.toastr.success('You no longer follow ' + member.displayname)
    })
    this.isFollow = false
  }

  //block & unblock
  block(member: Member){
    this.blockService.block(member.id).subscribe({
      next: () => this.toastr.success('You have blocked' + member.displayname)
    })
    if(this.isFollow) this.unfollow(member)
    this.isMemberBlocked = true
    //this.blockStatusChanged.emit(this.isMemberBlocked); // Emit the event to notify the parent
  }

  unblock(member: Member){
    this.blockService.unblock(member.id).subscribe({
      next: () => this.toastr.success('You have unblocked' + member.displayname)
    })
    this.isMemberBlocked = false
    //this.blockStatusChanged.emit(this.isMemberBlocked); // Emit the event to notify the parent
  }

  hasAdminRole(): boolean {
    const user = this.user;
    if (user && user.roles && user.roles.length > 0) {
        return user.roles.includes('Admin');
    }
    return false;
  }
}
