import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Trill } from '../_models/trill';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {
  baseUrl = environment.apiUrl; //'api/'
  trills: Trill[] = []

  constructor(private http: HttpClient) { }

  getBookmarks(){
    //return this.http.get<Bookmark[]>(this.baseUrl + 'users/bookmarks');
    if (this.trills.length > 0) return of(this.trills);
    return this.http.get<Trill[]>(this.baseUrl + 'users/bookmarks').pipe(
      map(trills => {
        this.trills = trills;
        return trills;
      })
    )
  }

  addBookmark(trillId: number) {
    return this.http.post(this.baseUrl + 'users/bookmarks/add?trillId=' + trillId, {});
  }

  deleteBookmark(trillId: number) {
    return this.http.delete(this.baseUrl + 'users/bookmarks/delete?trillId=' + trillId, {});
  }

  getBookmark(trillId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}users/bookmark?trillId=${trillId}`, {});
  }
}
