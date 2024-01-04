import { Component, Input } from '@angular/core';
import { RecentChat } from '../../../_models/recentChat';
import { MemberService } from '../../../_services/member.service';
import { Router } from '@angular/router';
import { Member } from '../../../_models/member';
import { PresenceService } from '../../../_services/presence.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css'
})
export class ChatCardComponent {
  @Input() chat: RecentChat | undefined;
  member: Member| undefined

  constructor(private memberService: MemberService, private router: Router,
    public presenceService: PresenceService){}

  ngOnInit(): void {
    if(this.chat){
      this.memberService.getMember(this.chat?.chatPartnerUsername).subscribe({
        next: response => {
          this.member = response;
        }
      })
      console.log(this.chat)
    }
  }

  getTruncatedMessage(message: string, maxLength: number): string {
    if(this.chat?.recentMessage)
      return message.length <= maxLength ? message : message.slice(0, maxLength) + '...';
    return "";
  }
}
