import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  baseUrl = environment.apiUrl;

  // Create a BehaviorSubject to store the current user information.
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  followers: Member[] = [];
  following: any;

  bookmarks: number[] = [];

  notifications: Notification[] = [];

  private notificationSource = new BehaviorSubject<Notification[]>([]);
  notification$ = this.notificationSource.asObservable();

  constructor(private http: HttpClient, //private presenceService: PresenceService
    ) { }

  // Function to send a login request to the server.
  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;    // Extract the user data from the response.
        // If a user is received from the server, store it in local storage and update the currentUserSource.
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  getNotifications(): Observable<Notification[]>{
      return this.http.get<Notification[]>(`${this.baseUrl}notification`).pipe(
        map(notifications => {
          this.notificationSource.next(notifications)
          console.log('from service notifications are ', notifications)
          return notifications;
        })
      )
  }

  // Function to send a register request to the server.
  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    );
  }

  // Function to set the current user.
  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    this.currentUserSource.next(user);
    //this.presenceService.createHubConnection(user);
  }

  // Function to log the user out.
  logout() {
    // Remove the user data from local storage and update the currentUserSource to null.
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    //this.presenceService.stopHubConnection();
  }

  follow(username: string){
    return this.http.post(this.baseUrl + 'follow/' + username, {});
  }

  getDecodedToken(token: string){
    return JSON.parse(atob(token.split('.')[1]));
  }

  destroyBookmarks() {
    this.bookmarks = [];
  }
}
