import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { firstValueFrom, of, switchMap, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatCardComponent } from './chat-card/chat-card.component';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { Pagination, RecentChat, User, Member } from '../../shared/models.index';
import { MessageService, AccountService, MemberService, PresenceService } from '../../shared/services.index';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChatCardComponent, ChatBubbleComponent, TranslateModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages: any;
  pagination?: Pagination;
  container = 'inbox';
  pageNumber = 1;
  pageSize = 5;
  chats?: RecentChat[];
  currentUser: User | null = null;
  member: Member | null = null;
  username = '';
  messageContent = '';

  private memberService = inject(MemberService)
  private accountService = inject(AccountService)
  public messageService = inject(MessageService)
  public presenceService = inject(PresenceService)
  private route = inject(ActivatedRoute)



  async ngOnInit(): Promise<void> {
    this.currentUser = await firstValueFrom(this.accountService.currentUser$.pipe(take(1)));
    this.setupRouteListener();
    this.loadChats();
  }

  sendMessage(username: string): void {
    this.messageService.sendMessage(username, this.messageContent);
    this.messageContent = '';
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  loadMessages(): void {
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response => {
        this.messages = response.result;
        this.pagination = response.pagination;
      }
    });
  }

  getMessageThread(username: string): void {
    if (!this.currentUser) return;
    this.messageService.createHubConnection(this.currentUser, username);
  }

  async loadChats(): Promise<void> {
    try {
      this.chats = await firstValueFrom(this.messageService.getChats());
      console.log('response load chats is ', this.chats);
    } catch (error) {
      console.error('Error loading chats', error);
    }
  }

  pageChanged(event: any): void {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
    }
  }

  loadMember(): void {
    if (this.username && this.currentUser) {
      this.memberService.getMember(this.username).subscribe({
        next: member => (this.member = member)
      });
    }
  }

  private setupRouteListener(): void {
    this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          this.username = params.get('username') || '';
          this.loadMember();
          this.getMessageThread(this.username);
          return of(null);
        })
      ).subscribe();
  }
}
