import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reply } from '../_models/reply';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {
  baseUrl = environment.apiUrl; //'api/'

  private http = inject(HttpClient)

  //get a reply by ID
  getReplyById(replyId: number): Observable<Reply> {
    return this.http.get<Reply>(`${this.baseUrl}trillreply/id/?replyId=${replyId}`)
  }

  //like a reply
  likeReply(trillReplyId: number) {
    return this.http.post(this.baseUrl + 'trillreply/like/?trillReplyId=' + trillReplyId, {});
  }

  //dislike a reply
  dislikeReply(trillReplyId: number) {
    return this.http.post(this.baseUrl + 'trillreply/dislike/?trillReplyId=' + trillReplyId, {});
  }

  //dislike a reply
  removeReply(trillReplyId: number) {
    return this.http.delete(this.baseUrl + 'trillreply/remove/?replyId=' + trillReplyId, {});
  }


  //get user reaction for a reply
  getUserReaction(trillReplyId: number): Observable<boolean | null> {
    const url = `${this.baseUrl}trillreply/reaction/${trillReplyId}`; // Remove the extra slash after "/api"
    return this.http.get<boolean | null>(url);
  }
}
