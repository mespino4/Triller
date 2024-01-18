import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Notification } from '../_models/notification';
import { User, Member } from '../shared/models.index';
import { LanguageService, PresenceService } from '../shared/services.index';

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

  constructor(private http: HttpClient, private presenceService: PresenceService,
    private language: LanguageService,)  { }

  // Function to send a login request to the server.
  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.language.setInitialLanguage(user.language)
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

  register(model: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
        return user; // Pass the user through the observable chain
      })
    );
  }
  

  // Function to set the current user.
  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }

  // Function to log the user out.
  logout() {
    // Remove the user data from local storage and update the currentUserSource to null.
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  setLanguage(isEnglish: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}account/language/set?isEnglish=${isEnglish}`, {})
      .pipe(
        catchError(() => {
          console.error('Error toggling language');
          return throwError(() => new Error('Error toggling language'));
        })
    );
  }

  deleteAccount(userId: number) {
    return this.http.delete(this.baseUrl + 'account/delete?userId=' + userId, {});
  }

  getLanguage(): Observable<string> {
    return this.http.get(`${this.baseUrl}account/language/get`, { responseType: 'text' })
      .pipe(
        catchError(() => throwError('Error fetching language'))
      );
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
