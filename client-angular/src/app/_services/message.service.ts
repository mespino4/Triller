import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, take } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { getPaginatedResult, getPaginationHeaders } from '../helpers/pagination';
import { User, RecentChat, Message } from '../shared/models.index';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl; //'api/'
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection | undefined;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  private http = inject(HttpClient)

  createHubConnection(user: User, otherUsername: string) {
    //this.busyService.busy();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start()
      .catch(error => console.log(error))
      //.finally(() => this.busyService.idle());

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    })



    
    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message])
      })
      this.playSoundEffect()
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop();
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
  }

  async getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/'+ username)
  }

  getChats(){
    return this.http.get<RecentChat[]>(this.baseUrl + 'messages/chats')
  }

  openInbox(username: string){
    return this.http.post(this.baseUrl + 'messages/inbox/' + username ,{})
  }

  async sendMessage(username: string, content: string){
    return this.hubConnection?.invoke('SendMessage', {recipientUsername: username, content})
      .catch(error => console.log(error));
    //return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, content})
  }

  //delete message
  deleteMessage(messageId: number) {
    return this.http.delete(this.baseUrl + 'messages?messageId=' + messageId, {});
  }

  private sound: HTMLAudioElement = new Audio();

  playSoundEffect(): void {
    this.sound.src = 'assets/sounds/messageSFX.ogg'; // Adjust the path based on your file structure
    this.sound.load();
    this.sound.play();
  }
}
