import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../_modals/confirm-modal/confirm-modal.component';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Clipboard } from '@angular/cdk/clipboard';
import { Member,  User, Trill } from '../../shared/models.index';
import { AccountService, LanguageService, 
        MemberService, TrillService, BookmarkService } 
        from '../../shared/services.index';


@Component({
  selector: 'app-trill-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ],
  templateUrl: './trill-card.component.html',
  styleUrl: './trill-card.component.css'
})

export class TrillCardComponent {
  private memberService = inject(MemberService)
  private bookmarkService = inject(BookmarkService)
  private languageService = inject(LanguageService)
  private accountService = inject(AccountService)
  private trillService = inject(TrillService)
  private clipboard = inject(Clipboard)
  private toastr = inject(ToastrService)
  private dialog = inject(MatDialog)

  @Input() trill: Trill | undefined;
  isTrillLiked: boolean | undefined
  isRetrilled: boolean | undefined
  isBookmarked: boolean | undefined
  member$: Member| undefined
  user: User | null = null;

  localTimestamp: string | undefined

  isTrillDestroyed: boolean = false;

  language: string = this.languageService.getCurrentLanguage();
    
  ngOnInit(): void {
    if (this.trill && this.trill.id) {
      this.loadTrillData(this.trill.id);
      //this.localTimestamp = new Date(this.trill?.timestamp).toLocaleString();
    }
    this.setupUserAndTrill()
  }

  setupUserAndTrill(){
    if(this.trill)
      this.memberService.getMemberById(this.trill?.authorId).subscribe({
        next: member => this.member$ = member
      });

    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })  
  }

  loadTrillData(trillId: number): void {
    this.getReaction(trillId);
    this.getRetrill(trillId);
    this.getBookmark(trillId);
  }

  //reactions
  getReaction(trillId: number): void {
    this.trillService.getTrillLike(trillId).subscribe({
      next: (result) => this.isTrillLiked = result,
      error: (error) => this.handleTrillError('Error getting trill like', error)
    });
  }

  likeTrill(trillId: number): void {
    this.trillService.likeTrill(trillId).subscribe({
      next: () => {this.toastr.success('Trill liked successfully');},
      error: (error) => this.handleTrillError('Error liking trill', error)
    });
    this.trill!.likes++;
    this.isTrillLiked = true;
  }

  deleteLike(trillId: number): void {
    this.trillService.deleteTrillLike(trillId).subscribe({
      next: () => this.toastr.success('Like removed successfully'),
      error: (error) => this.handleTrillError('Error removing like', error)
    });
    this.trill!.likes--;
    this.isTrillLiked = false
  }

  //Retrills
  retrill(trillId: number): void {
    if (this.member$?.username === this.user?.username) {
      this.toastr.error('Cannot Repost your own Trill');
    } else {
      this.trillService.retrill(trillId).subscribe({
        next: () => {this.toastr.success('Reposted Trill successfully');
        this.trill!.retrills++;
        this.isRetrilled = true;
      },error: (error) => this.handleTrillError('Error reposting Trill', error)
      });
    }
  }

  getRetrill(trillId: number): void {
    this.trillService.getRetrill(trillId).subscribe({
      next: (result) => this.isRetrilled = result,
      error: (error) => this.handleTrillError('Error getting retrill', error)
    });
  }

  deleteRetrill(trillId: number): void {
    this.trillService.deleteRetrill(trillId).subscribe({
      next: () => {
        this.toastr.success('Retrill removed successfully');
          this.trill!.retrills--;
          this.isRetrilled = false;
      },
      error: (error) => this.handleTrillError('Error removing retrill', error)
    });
  }
  
  //bookmarks
  addBookmark(trillId: number): void {
    this.bookmarkService.addBookmark(trillId).subscribe({
      next: () => this.toastr.success('Trill bookmarked'),
      error: (error) => this.handleTrillError('Error bookmarking trill', error)
    });
    this.isBookmarked = true
  }

  deleteBookmark(trillId: number): void {
    this.bookmarkService.deleteBookmark(trillId).subscribe({
      next: () => this.toastr.success('Bookmark removed successfully'),
      error: (error) => this.handleTrillError('Error removing bookmark', error)
    });
    this.isBookmarked = false
  }

  getBookmark(trillId: number): void {
    this.bookmarkService.getBookmark(trillId).subscribe({
      next: (result) => this.isBookmarked = result,
      error: (error) => this.handleTrillError('Error getting bookmark', error)
    });
  }

  //delete trill
  deleteTrill(trillId: number): void {
    let msg: string;

    switch (this.language) {
      case 'en':
        msg = 'Are you sure you want to delete this trill?';
        break;
      case 'es':
        msg = '¿Estás seguro de que quieres eliminar este trill?';
        break;
      default:
        msg = 'Are you sure you want to delete this trill?';
    }

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {message: msg},
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.trillService.deleteTrill(trillId).subscribe({
          next: () => {
            this.toastr.success('Trill removed successfully');
            this.isTrillDestroyed = true;
          },
          error: (error) => this.handleTrillError('Error removing trill', error)
        });
      }
    });
  }

  //share
  shareButton() {
    if (this.trill) {
      const currentUrl = window.location.origin;
      const trillUrl = '/trill/' + this.trill?.id;
      const fullTrillUrl = currentUrl + trillUrl;
  
      this.clipboard.copy(fullTrillUrl);
      this.toastr.success('Link to Trill copied');
    }
  }  

  hasModeratorRole(): boolean {
    const user = this.user;
    if (user && user.roles && user.roles.length > 0) {
        return user.roles.includes('Moderator');
    }
    return false;
  }
  
  handleTrillError(message: string, error: any): void {
    console.error(message, error);
    this.toastr.error(message);
  }
}