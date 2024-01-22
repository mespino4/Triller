import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  baseUrl = environment.apiUrl;
  
  private http = inject(HttpClient)
  
  block(blockUserId: number){
    return this.http.post<boolean>(this.baseUrl + 'users/block?blockUserId=' + blockUserId, {});
  }

  unblock(blockUserId: number){
    return this.http.delete<boolean>(this.baseUrl + 'users/unblock?blockUserId=' + blockUserId, {});
  }

  getBlockedUsers(){
    return this.http.get<Member[]>(this.baseUrl + 'users/blocked-users');
  }
  
  getMemberBlockStatus(memberId: number){ //this checks if a member is blocked by th euser
    return this.http.get<boolean>(this.baseUrl + 'users/member-block-status?memberId=' + memberId, {});
  }

  getUserBlockStatus(memberId: number){ //this checks if the user has blocked been blocked by the member
    return this.http.get<boolean>(this.baseUrl + 'users/user-block-status?memberId=' + memberId, {});
  }
}
