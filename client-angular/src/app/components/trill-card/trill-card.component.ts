import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Trill } from '../../_models/trill';
import { Member } from '../../_models/member';
import { User } from '../../_models/user';
import { TrillService } from '../../_services/trill.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';
import { BookmarksService } from '../../_services/bookmarks.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../_modals/confirm/confirm.component';
import { MemberService } from '../../_services/member.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-trill-card',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './trill-card.component.html',
  styleUrl: './trill-card.component.css'
})

export class TrillCardComponent {
  @Input() trill: Trill | undefined;
  isTrillLiked: boolean | undefined
  isRetrilled: boolean | undefined
  isBookmarked: boolean | undefined
  member$: Member| undefined
  user: User | null = null;

  localTimestamp: string | undefined

  constructor(private trillService: TrillService, private toastr: ToastrService,
    public accountService: AccountService, public memberService: MemberService,
    private bookmarksService: BookmarksService, private clipboard: Clipboard,
    public dialog: MatDialog){
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
      })
    }
    
  ngOnInit(): void {
    if (this.trill && this.trill.id) {
      this.loadTrillData(this.trill.id);
      //this.localTimestamp = new Date(this.trill?.timestamp).toLocaleString();
    }
    this.loadMember()
  }

  ngOnDestroy(): void {
    this.trill = undefined
  }

  loadMember() {
    if(this.trill)
      this.memberService.getMemberById(this.trill?.authorId).subscribe({
        next: member => this.member$ = member
      });
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
      next: () => this.toastr.success('Trill liked successfully'),
      error: (error) => this.handleTrillError('Error liking trill', error)
    });
  }

  deleteLike(trillId: number): void {
    this.trillService.deleteTrillLike(trillId).subscribe({
      next: () => this.toastr.success('Like removed successfully'),
      error: (error) => this.handleTrillError('Error removing like', error)
    });
  }

  //Retrills
  retrill(trillId: number): void {
    if (this.member$?.username === this.user?.username) {
      this.toastr.error('Cannot Repost your own Trill');
    } else {
      this.trillService.retrill(trillId).subscribe({
        next: () => this.toastr.success('Reposted Trill successfully'),
        error: (error) => this.handleTrillError('Error reposting Trill', error)
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
      next: () => this.toastr.success('Retrill removed successfully'),
      error: (error) => this.handleTrillError('Error removing retrill', error)
    });
  }

  //bookmarks
  addBookmark(trillId: number): void {
    this.bookmarksService.addBookmark(trillId).subscribe({
      next: () => this.toastr.success('Trill bookmarked'),
      error: (error) => this.handleTrillError('Error bookmarking trill', error)
    });
  }

  deleteBookmark(trillId: number): void {
    this.bookmarksService.deleteBookmark(trillId).subscribe({
      next: () => this.toastr.success('Bookmark removed successfully'),
      error: (error) => this.handleTrillError('Error removing bookmark', error)
    });
  }

  getBookmark(trillId: number): void {
    this.bookmarksService.getBookmark(trillId).subscribe({
      next: (result) => this.isBookmarked = result,
      error: (error) => this.handleTrillError('Error getting bookmark', error)
    });
  }

  //delete trill
  deleteTrill(trillId: number): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        message: 'Are you sure you want to delete this trill?',
        id: trillId,
        obj2Del: 'trill',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.trillService.deleteTrill(trillId).subscribe({
          next: () => this.toastr.success('Trill removed successfully'),
          error: (error) => this.handleTrillError('Error removing trill', error)
        });
      }
    });
  }

  //share
  shareButton() {
    if(this.trill){
      this.clipboard.copy(environment.clientUrl + 'trill/' + this.trill?.id);
      this.toastr.success('Link to Trill copied')
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
