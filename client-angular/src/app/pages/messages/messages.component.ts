import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
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
export class MessagesComponent {
  messages: any
  pagination?: Pagination;
  container = 'inbox';//unread, inbox, outbox
  pageNumber = 1;
  pageSize = 5;
  chats?: RecentChat[];
  currentUser?: User | null = null;
  member?: Member | null = null;
  username: string = '';

  messageContent: string = '';

  constructor(public messageService: MessageService, private accountService: AccountService,
    private route: ActivatedRoute, private memberService: MemberService, public presenceService: PresenceService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.currentUser = user
      })
      this.loadChats();
  }

  sendMessage(username: string) {
    this.messageService.sendMessage(username, this.messageContent)
    this.messageContent = ""
  }

  ngOnInit() {
    this.loadChats();
    this.setupRouteListener();
  }

  ngOnChange(){}

  ngOnDestroy(): void {
    this.messageService.stopHubConnection()
  }
  
  loadMessages() {
    this.messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe({
        next: response => {
          this.messages = response.result;
          this.pagination = response.pagination;
        }
      });
  }
  
  getMessageThread(username: string) {
    if (!this.currentUser) return;
    this.messageService.createHubConnection(this.currentUser, username);
  }

  loadChats() {
    this.messageService.getChats().subscribe({
      next: response => {
        this.chats = response;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
    }
  }

  loadMember() {
    if (!this.username || !this.currentUser) return;

    this.memberService.getMember(this.username).subscribe({
      next: member => (this.member = member)
    });
  }

  private setupRouteListener() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.username = params.get('username') || '';
          this.loadMember();
          //this.getMessageThread(this.username);
          return of(null);
        })
      ).subscribe();
  }
}