import { Component, Input } from '@angular/core';
import { Member } from '../../../_models/member';
import { MemberService } from '../../../_services/member.service';
import { Notification } from '../../../_models/notification';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  @Input() notification: Notification | undefined;
  type: string | undefined; //Reply, Repost, Like, Follow
  member: Member | undefined;
  content: string | undefined;

  constructor(public memberService: MemberService){}

  ngOnInit(): void {
    if(!this.notification) return
    this.loadMember()
    this.type = this.notification.type
    this.loadContent()
  }

  loadMember(){
    if(!this.notification) return
    this.memberService.getMemberById(this.notification?.memberId).subscribe({
      next: member => this.member = member
    })
  }

  loadContent(){
    if(!this.type) return
    if (this.type == 'Reply')
      this.content = 'replied to your trill' 
    else if(this.type == 'Repost')
      this.content = 'reposted your trill'
    else if(this.type == 'Like')
      this.content = 'liked your trill'
    else if(this.type == 'Follow')
      this.content = 'followed you'
  }
}
