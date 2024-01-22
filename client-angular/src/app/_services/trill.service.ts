import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Trill } from '../_models/trill';
import { PaginatedResult } from '../_models/pagination';
import { getPaginatedResult, getPaginationHeaders } from '../helpers/pagination';
import { Reply } from '../_models/reply';

@Injectable({
  providedIn: 'root'
})
export class TrillService {
  baseUrl = environment.apiUrl; //'api/'
  trill: Trill | undefined
  trills: Trill[] = [];
  userTrills: Trill[] = [];
  trillCache = new Map<string, any>();
  forYouTrillCache = new Map<string, any>();
  followingTrillCache = new Map<string, any>();

  paginatedResult: PaginatedResult<Trill[]> = new PaginatedResult<Trill[]>;

  private http = inject(HttpClient)

  //All Trills
  getTrills(page: number, itemsPerPage: number): Observable<PaginatedResult<Trill[]>> {
    const cacheKey = `${page}-${itemsPerPage}`;
    const cachedResponse = this.trillCache.get(cacheKey);

    if (cachedResponse) {
      console.log('Data retrieved from cache:', cachedResponse);
      return of(cachedResponse);
    }

    const params = getPaginationHeaders(page, itemsPerPage);

    return getPaginatedResult<Trill[]>(`${this.baseUrl}trill`, params, this.http)
      .pipe(
        map(response => {
          this.trillCache.set(cacheKey, response);
          return response;
        })
      );
  }

  //All ForYou Trills
  getForYouTrills(page: number, itemsPerPage: number): Observable<PaginatedResult<Trill[]>> {
    const cacheKey = `${page}-${itemsPerPage}`;
    const cachedResponse = this.trillCache.get(cacheKey);

    if (cachedResponse) {
      console.log('Data retrieved from cache:', cachedResponse);
      return of(cachedResponse);
    }

    const params = getPaginationHeaders(page, itemsPerPage);

    return getPaginatedResult<Trill[]>(`${this.baseUrl}trill/for-you`, params, this.http)
      .pipe(
        map(response => {
          this.forYouTrillCache.set(cacheKey, response);
          return response;
        })
      );
  }

  //All ForYou Trills
  getFollowingTrills(page: number, itemsPerPage: number): Observable<PaginatedResult<Trill[]>> {
    const cacheKey = `${page}-${itemsPerPage}`;
    const cachedResponse = this.trillCache.get(cacheKey);

    if (cachedResponse) {
      console.log('Data retrieved from cache:', cachedResponse);
      return of(cachedResponse);
    }

    const params = getPaginationHeaders(page, itemsPerPage);

    return getPaginatedResult<Trill[]>(`${this.baseUrl}trill/following`, params, this.http)
      .pipe(
        map(response => {
          this.followingTrillCache.set(cacheKey, response);
          return response;
        })
      );
  }

  getUserTrills(userId: number){
    //console.log('from getUserTrills ' + this.baseUrl + 'trill/' + userId)
    if (this.userTrills.length > 0) return of(this.userTrills);
    return this.http.get<Trill[]>(this.baseUrl + 'trill/' + userId).pipe(
      map(userTrills => {
        this.userTrills = userTrills;
        return userTrills;
      })
    )
  }
  
  getTrillById(trillId: number): Observable<Trill> {
    return this.http.get<Trill>(`${this.baseUrl}trill/id/?trillId=${trillId}`)
  }

  getTrillRepliesById(trillId: number): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.baseUrl}trill/replies/?trillId=${trillId}`);
  }
  
  //i think this was used for bookmarks
  getTrillsByIds(trillIds: number[]): Observable<Trill[]> {
    const requests = trillIds.map((trillId) =>
      this.http.get<Trill>(`${this.baseUrl}trill/id/?trillId=${trillId}`)
    );
  
    // Use forkJoin to combine multiple observables into one
    return forkJoin(requests);
  }

  createTrill(content: string, file?: File) {
    // Create form data to handle content and file
    const formData = new FormData();
    formData.append('content', content);
    if (file)
      formData.append('file', file, file.name);

    // Headers for handling multipart/form-data
    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.post<Trill[]>(this.baseUrl + 'trill', formData, { headers });
  }

  deleteTrill(trillId: number) {
    return this.http.delete(this.baseUrl + 'trill?trillId=' + trillId, {});
  }

  createReply(trillId: number, content: string, file?: File) {
    // Create form data to handle content and file
    const formData = new FormData();
    formData.append('content', content);
    if (file)
      formData.append('file', file, file.name);

    // Headers for handling multipart/form-data
    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.post<Trill[]>(this.baseUrl + 'trill/reply/' + trillId, formData, { headers });
  }

  likeTrill(trillId: number) {
    return this.http.post(this.baseUrl + 'trill/like/add?trillId=' + trillId, {});
  }

  deleteTrillLike(trillId: number) {
    return this.http.delete(`${this.baseUrl}trill/like/delete?trillId=${trillId}`);
  }
  

  getTrillLike(trillId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}trill/like?trillId=${trillId}`, {});
  }

  retrill(trillId: number) {
    return this.http.post(this.baseUrl + 'trill/retrill/add?trillId=' + trillId, {});
  }

  getRetrill(trillId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}trill/retrill?trillId=${trillId}`, {});
  }

  deleteRetrill(trillId: number) {
    return this.http.delete(this.baseUrl + 'trill/retrill/delete?trillId=' + trillId, {});
  }

  destroyTrills(){
    this.trills = []
  }
  destroyUserTrills(){
    this.userTrills = []
  }
  
}
