import { Component } from '@angular/core';
import { Pagination } from '../../_models/pagination';
import { RecentChat } from '../../_models/recentChat';
import { User } from '../../_models/user';
import { Member } from '../../_models/member';
import { MessageService } from '../../_services/message.service';
import { AccountService } from '../../_services/account.service';
import { MemberService } from '../../_services/member.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatCardComponent } from './chat-card/chat-card.component';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChatCardComponent, ChatBubbleComponent],
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

  messageContent: string = '';

  constructor(public messageService: MessageService, private accountService: AccountService,
    private route: ActivatedRoute, private memberService: MemberService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.currentUser = user
      })
      this.loadMember()
      this.loadChats();
  }

  sendMessage(username: string) {
    this.messageService.sendMessage(username, this.messageContent)
    this.messageContent = ""
  }


  ngOnInit(): void {
    //this.loadMessages();
    this.loadChats();
    this.loadMember();

    var username = this.route.snapshot.paramMap.get('username')
    if (!username) return;
    this.getMessageThread(username)
    console.log("thse are the cvhats ", this.chats)
  }

  ngOnChange(){}

  ngOnDestroy(): void {
    this.messageService.stopHubConnection()
  }
  
  loadMessages() {
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response => {
        console.log(response)
        this.messages = response.result;
        this.pagination = response.pagination;
        //console.log(this.messages)
      }
    })
  }
  
  getMessageThread(username: string){
    this.loadMember();
    if(!this.currentUser) return
    this.messageService.createHubConnection(this.currentUser, username)
  }

  loadChats() {
    this.messageService.getChats().subscribe({
      next: response => {
        console.log('thse are the chats uihi' , response)
        this.chats = response;
      }
    })
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      //this.loadMessages();
    }
  }

  loadMember() {
    var username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => this.member = member
    });
  }
}
