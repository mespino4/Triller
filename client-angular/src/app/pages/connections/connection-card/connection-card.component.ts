import { Component, Input } from '@angular/core';
import { Member } from '../../../_models/member';
import { User } from '../../../_models/user';
import { MemberService } from '../../../_services/member.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../_services/account.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-connection-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.css'
})
export class ConnectionCardComponent {
  @Input() member: Member | undefined
  @Input() user: User | null = null;

  followers: Member[] = []; // Define an array to store followers
  following: Member[] = []; // Define an array to store following

  isFollow: boolean = true

  constructor( private memberService: MemberService,
    private toastr: ToastrService, public accountService: AccountService) {}
    
  ngOnInit(): void {
    if(this.member){
      this.getUserConection(this.member);
    }
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

  getFollowers(){
    this.memberService.getConnections('followers').subscribe({
      next: response =>  {
        this.followers = response
      }
    })
  }

  getFollowing(){
    this.memberService.getConnections('following').subscribe({
      next: response =>  {
        this.following = response
      }
    })
  }
}
