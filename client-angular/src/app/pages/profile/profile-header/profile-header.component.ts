import { Component, Input, inject} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileModalComponent } from '../../../_modals/edit-profile-modal/edit-profile-modal.component';
import { User, Member } from '../../../shared/models.index';
import { MessageService, AccountService, MemberService, 
        PresenceService, BlockService} from '../../../shared/services.index';
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

  isOnline: boolean | undefined

  private memberService = inject(MemberService)
  private accountService = inject(AccountService)
  private blockService = inject(BlockService)
  private messageService = inject(MessageService)
  public presenceService = inject(PresenceService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  public toastr = inject(ToastrService)
  public dialog = inject(MatDialog)

  ngOnInit(): void {
    if (this.member){
      this.initializeProfile();
      this.online(this.member);
      this.connectionStatus(this.member);
    }

    if (this.member?.username === this.user?.username)
      this.isUser = true;
    else 
      this.isUser = false;
  }

  private initializeProfile(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleRouteChanges();
      }
    });
  }

  private handleRouteChanges(): void {
    const updatedUsername = this.route.snapshot.paramMap.get('username');

    if (updatedUsername !== this.member?.username) {
      this.member = undefined; // Reset member data
      this.isUser = undefined; // Reset user data
      this.isOnline = undefined; // Reset online status
      this.isFollow = null; // Reset follow status
      this.isMemberBlocked = null; // Reset block status

      this.ngOnInit()
    }
  }

  editProfile(member: Member): void {
    const dialogRef = this.dialog.open(EditProfileModalComponent, {
      width: '400px',
      data: { member: member }
    });

    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance;
    });
  }

  private online(member: Member): void {
    this.presenceService.onlineUsers$.subscribe({
      next: response => this.isOnline = response.includes(member.username)
    });
  }

  chatButton(username: string): void {
    this.messageService.openInbox(username).subscribe();
  }  

  //connections
  private connectionStatus(member: Member): void {
    this.memberService.getConnectionStatus(member.id).subscribe({
      next: response => this.isFollow = response,
      error: error => console.error('Error fetching blocked members:', error),
      complete: () => console.log('this is the follow ', this.isFollow)
    });
  }

  follow(member: Member): void {
    this.memberService.follow(member.id).subscribe({
      next: () => this.toastr.success(`You now follow ${member.displayname}`)
    });
    this.isFollow = true;
  }

  unfollow(member: Member): void {
    this.memberService.unfollow(member.id).subscribe({
      next: () => this.toastr.success(`You no longer follow ${member.displayname}`)
    });
    this.isFollow = false;
  }

  //block & unblock
  block(member: Member): void {
    this.blockService.block(member.id).subscribe({
      next: () => this.toastr.success(`You have blocked ${member.displayname}`)
    });
    if (this.isFollow) this.unfollow(member);
    this.isMemberBlocked = true;
  }

  unblock(member: Member): void {
    this.blockService.unblock(member.id).subscribe({
      next: () => this.toastr.success(`You have unblocked ${member.displayname}`)
    });
    this.isMemberBlocked = false;
  }

  hasAdminRole(): boolean {
    return !!this.user?.roles && this.user.roles.includes('Admin');
  }
}
