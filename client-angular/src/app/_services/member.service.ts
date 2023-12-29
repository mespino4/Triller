import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Member } from '../_models/member';
import { User } from '../_models/user';
import { AccountService } from './account.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, take } from 'rxjs';
import { Trill } from '../_models/trill';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  user?: User | undefined
  trills: Trill[] = [];

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user)
          //this.userParams = new UserParams(user);
          this.user = user;
      }
    })
  }

  getMembers(){
    if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  }

  getMember(username: string){
    const member = this.members.find(x => x.username === username);
    if(member) return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/username/' + username);
  }

  getMemberById(userId: number){
    const member = this.members.find(x => x.id === userId);
    if(member) return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/id/' + userId);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    )
  }

  getTimeline(username: string): Observable<Trill[]>{
    if (this.trills.length > 0) return of(this.trills);
    return this.http.get<Trill[]>(`${this.baseUrl}users/timeline?username=${username}`).pipe(
      map(trills => {
        this.trills = trills;
        return trills;
      })
    )
  }
  
  follow(userId: number){
    return this.http.post(this.baseUrl + 'users/connections/follow?targetUserId=' + userId, {});
  }

  unfollow(userId: number){
    return this.http.delete(this.baseUrl + 'users/connections/unfollow?targetUserId=' + userId, {});
  }

  getConnections(predicate: string){
    return this.http.get<Member[]>(this.baseUrl + 'users/connections/?predicate=' + predicate);
  }

  getUserConnection(userId: number): Observable<boolean>{
    return this.http.get<boolean>(this.baseUrl + 'users/connections/status?targetUserId=' + userId);
  }

  updateProfilePic(file: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}users/profile-pic/update`, file);
  }

  updateBannerPic(file: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}users/banner-pic/update`, file);
  }
}
