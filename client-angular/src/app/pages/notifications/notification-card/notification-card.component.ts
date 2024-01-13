import { Component, Input, inject } from '@angular/core';
import { MemberService } from '../../../_services/member.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../shared/services.index';
import { Member, Notification } from '../../../shared/models.index';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, TranslateModule],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  private memberService = inject(MemberService)
  private languageService = inject(LanguageService)

  @Input() notification: Notification | undefined;
  type: string | undefined; //Reply, Repost, Like, Follow
  member: Member | undefined;
  content: string | undefined;

  language: string = this.languageService.getCurrentLanguage();
  
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

  loadContent() {
    if (!this.type || !this.notification) return;

    switch (this.type) {
      case 'Reply':
        this.content = this.languageService.getTranslation('notifications','reply');
        break;
      case 'Repost':
        this.content = this.languageService.getTranslation('notifications','repost');
        break;
      case 'Like':
        this.content = this.languageService.getTranslation('notifications','like');
        break;
      case 'Follow':
        this.content = this.languageService.getTranslation('notifications','follow');
        break;
      default:
        break;
    }
  }
}
