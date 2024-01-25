import { Component } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TrillCardComponent } from '../../components/trill-card/trill-card.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule} from '@ngx-translate/core';
import { AccountService, BookmarkService, TrillService } from '../../shared/services.index';
import { Trill, User } from '../../shared/models.index';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, TrillCardComponent, TranslateModule],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css'
})
export class BookmarksComponent {
  user: User | null = null;
  bookmarks: number[] | undefined
  isEmpty: boolean | undefined
  trills$: Observable<Trill[]> | undefined;

  constructor(public trillService: TrillService, private http: HttpClient, 
    private accountService: AccountService, private bookmarkService: BookmarkService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
      })
  }

  ngOnInit(): void {
    this.getBookmarks()
  }

  async getBookmarks() {
    this.bookmarkService.getBookmarks().subscribe({
      next: response => {
        if (Array.isArray(response)) {
          this.trills$ = of(response.map(response => response));
          this.isEmpty = response.length === 0; // Set isEmpty based on array length
        }
      }
    });
  }
  
  emptyBookmarks(){
    this.trills$?.subscribe({
      next: (trills) => {
        if (trills.length === 0) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
        }
      },
      error: (error) => {console.error('Error in trills$ observable', error);},
    });
  }

  ngOnDestroy(): void {
    this.trillService.destroyTrills();
    this.accountService.destroyBookmarks();
  }
}
