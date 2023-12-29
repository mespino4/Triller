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
      if(this.trill){
        console.log('author id is  ' + this.trill.authorId)
        this.memberService.getMemberById(this.trill.authorId).pipe(take(1)).subscribe({
          next: member => this.member$ = member
        });
      }
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
      })
    }
    
  ngOnInit(): void {
    if (this.trill && this.trill.id) {
      this.getTrillLike(this.trill.id);
      this.getRetrill(this.trill.id);
      this.getBookmark(this.trill.id);
      this.localTimestamp = new Date(this.trill?.timestamp).toLocaleString();
    }
    this.loadMember()

    
  }

  likeTrill(trillId: number) {
    this.trillService.likeTrill(trillId).subscribe({
      next: () => {
          this.toastr.success('Trill liked successfully')
      },
      error: (error) => {
          console.error('Error liking trill', error);
          this.toastr.error('Error liking trill')
      }
    });
  }

  deleteLike(trillId: number) {
    this.trillService.deleteTrillLike(trillId).subscribe({
      next: () => {
        this.toastr.success('Like removed successfully');
      },
      error: (error) => {
        console.error('Error:', error);
        this.toastr.error('Error removing like');
      }
    });
  }

  getTrillLike(trillId: number) {
    this.trillService.getTrillLike(trillId).subscribe({
      next: (result) => {
        this.isTrillLiked = result;
        console.log('Trill is like' + result);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }  

  retrill(trillId: number) {
    if(this.member$?.username == this.user?.username){
      this.toastr.error('Cannot Retrill your own Trill');
    }else{
      this.trillService.retrill(trillId).subscribe({
        next: () => {
            this.toastr.success('Reposted Trill successfully')
        },
        error: (error) => {
            console.error('Error reposting Trill', error);
            this.toastr.error('Error reposting Trill')
        }
      });
    }
  }

  getRetrill(trillId: number) {
    this.trillService.getRetrill(trillId).subscribe({
      next: (result) => {
        this.isRetrilled = result;
        console.log('Trill is repose, ' + result);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  deleteRetrill(trillId: number) {
    this.trillService.deleteRetrill(trillId).subscribe({
      next: () => {
        this.toastr.success('Retrill removed successfully');
      },
      error: (error) => {
        console.error('Error:', error);
        this.toastr.error('Error removing retrill');
      }
    });
  }
  
  shareButton() {
    if(this.trill){
      this.clipboard.copy(environment.clientUrl + 'trill/' + this.trill?.id);
      this.toastr.success('Link to Trill copied')
    }
  }

  addBookmark(trillId: number) {
    this.bookmarksService.addBookmark(trillId).subscribe({
      next: () => {
          this.toastr.success('Trill bookmarked')
      },
      error: (error) => {
          console.error('Error bookmarking trill', error);
          this.toastr.error('Error bookmarking trill')
      }
    });
  }

  deleteBookmark(trillId: number) {
    this.bookmarksService.deleteBookmark(trillId).subscribe({
      next: () => {
        this.toastr.success('Bookmark removed successfully');
      },
      error: (error) => {
        console.error('Error:', error);
        this.toastr.error('Error removing bookmark');
      }
    });
  }

  getBookmark(trillId: number) {
    this.bookmarksService.getBookmark(trillId).subscribe({
      next: (result) => {
        this.isBookmarked = result;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }  
  
  loadMember() {
    //var username = this.route.snapshot.paramMap.get('username');
    //if (!username) return;
    if(this.trill)
      this.memberService.getMemberById(this.trill?.authorId).subscribe({
        next: member => this.member$ = member
      });
  }

  ngOnDestroy(): void {
    this.trill = undefined
  }

  deleteTrill(trillId: number): void {
    console.log('from delete trill ', trillId);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        message: 'Are you sure you want to delete this trill?',
        id: trillId,
        obj2Del: 'trill',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      // Check the result from the confirmation modal
      if (result === true) {
        // Proceed with deleting the trill
        this.trillService.deleteTrill(trillId).subscribe({
          next: () => {
            this.toastr.success('Trill removed successfully');
          },
          error: (error) => {
            console.error('Error:', error);
            this.toastr.error('Error removing trill');
          },
        });
      }
    });
  }

  hasModeratorRole(): boolean {
    const user = this.user;
    if (user && user.roles && user.roles.length > 0) {
        return user.roles.includes('Moderator');
    }
    return false;
  }
  
}
