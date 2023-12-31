import { Component, Input } from '@angular/core';
import { Member } from '../../../_models/member';
import { MemberService } from '../../../_services/member.service';
import { BlockService } from '../../../_services/block.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../_services/account.service';
import { take } from 'rxjs';
import { PresenceService } from '../../../_services/presence.service';
import { User } from '../../../_models/user';
import { MessageService } from '../../../_services/message.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() member: Member | undefined
  isFollow: boolean = true
  isUser: boolean | undefined
  user: User | null = null;
  @Input() isMemberBlocked: boolean | null = null;
  @Input() isUserBlocked: boolean | null = null;

  isOnline: boolean | undefined

  constructor( private memberService: MemberService, private messageService: MessageService,  
    private blockService: BlockService, private toastr: ToastrService, public accountService: AccountService,
    public presenceService: PresenceService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
    })
  }

  ngOnInit(): void {
    if(this.member){
      //this.getUserConection(this.member);
      this.online(this.member)
    }

    if(this.member?.username == this.user?.username){
      this.isUser = true
    }else{
      this.isUser = false
    }
  }

  ngOnChanges() {
    console.log("is online change", this.isOnline)
  }

  online(member: Member){
    console.log("is online 1", this.isOnline)
    this.presenceService.onlineUsers$.subscribe({
      next: response => console.log("users", response) //this.isOnline = response.includes(member.userName),
      
    })
    console.log("is online 2", this.isOnline)
    
  }

  
  chatButton(username: string) {
    this.messageService.openInbox(username).subscribe({
      next: response => console.log("inbox opened")
    })
  }

  getUserConection(member: Member){
    this.memberService.getUserConnection(member.id).subscribe({
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
