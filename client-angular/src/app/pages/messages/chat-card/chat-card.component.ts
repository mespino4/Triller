import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberService, PresenceService } from '../../../shared/services.index';
import { RecentChat, Member } from '../../../shared/models.index';

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

  getTruncatedText(text: string, maxLength: number): string {
    if(text == null) return ""
    return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
  }
}
