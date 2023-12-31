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

  getBookmarks(): Observable<Trill[]> {
    return this.trills.length > 0 ? of(this.trills) :
      this.http.get<Trill[]>(`${this.baseUrl}bookmarks`).pipe(
        map(trills => this.trills = trills)
      );
  }

  addBookmark(trillId: number) {
    return this.http.post(this.baseUrl + 'bookmark/add?trillId=' + trillId, {});
  }

  deleteBookmark(trillId: number) {
    return this.http.delete(this.baseUrl + 'bookmark/delete?trillId=' + trillId, {});
  }

  getBookmark(trillId: number): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + 'bookmark?trillId=' + trillId, {});
  }
}
