import { Component, Input } from '@angular/core';
import { Member, Reply, User } from '../../../shared/models.index';
import { AccountService, MemberService, ReplyService, TrillService } from '../../../shared/services.index';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalComponent } from '../../../_modals/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reply-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reply-card.component.html',
  styleUrl: './reply-card.component.css'
})
export class ReplyCardComponent {
  @Input() reply: Reply | undefined;
  isTrillLiked: boolean | undefined
  member$: Member| undefined
  isLike: boolean = false
  isDislike: boolean = false
  user: User | null = null;

  localTimestamp: string | undefined

  constructor(private trillService: TrillService, private toastr: ToastrService, 
    public accountService: AccountService, public memberService: MemberService, 
    public replyService: ReplyService, public dialog: MatDialog){
      if(this.reply){
        this.memberService.getMemberById(this.reply?.authorId).pipe(take(1)).subscribe({
          next: member => this.member$ = member
        });
      }

      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
      })  
  }
    
  ngOnInit(): void {
    this.getReplyReaction()
    this.loadMember()
  }

  like(replyId: number) {
    this.isLike = true
    this.isDislike = false
    this.replyService.likeReply(replyId).subscribe({
      next: () => {
        this.toastr.success('Reply liked successfully')
        this.isLike = true
        this.isDislike = false
      },error: (err) => {
        this.toastr.error('Error liking reply')
        console.error('Error liking reply', err);
      },
    });
  }

  dislike(replyId: number) {
    this.replyService.dislikeReply(replyId).subscribe({
      next: () => {
        this.isLike = false
        this.isDislike = true
        this.toastr.success('Reply disliked successfully')
      },error: (err) => {
        this.toastr.error('Error disliking reply')
        console.error('Error disliking reply', err);
      },
    });
  }

  getReplyReaction() {
    if (this.reply && this.reply.id) {
      this.replyService.getUserReaction(this.reply?.id).subscribe({
        next: (reaction: boolean | null) => {
          if (reaction === true) {
            this.isLike = true;
            this.isDislike = false;
          } else if (reaction === false) {
            this.isLike = false;
            this.isDislike = true;
          } else {
            this.isLike = false;
            this.isDislike = false;
          }
        },
        error: error => {console.error('Error getting user reaction', error);}
      });
    }
  }
  
  retrill(trillId: number) {
    this.trillService.retrill(trillId).subscribe({
      next: () => {this.toastr.success('Reposted Trill successfully')},
      error: (error) => {
          console.error('Error reposting Trill', error);
          this.toastr.error('Error reposting Trill')
      }
    });
  }

  deleteLike(trillId: number) {
    this.trillService.deleteTrillLike(trillId).subscribe({
      next: () => {this.toastr.success('Like removed successfully');},
      error: (error) => {
        console.error('Error:', error);
        this.toastr.error('Error removing like');
      }
    });
  }

  loadMember() {
    if(this.reply)
      this.memberService.getMemberById(this.reply?.authorId).subscribe({
        next: member => this.member$ = member
      });
  }

  ngOnDestroy(): void {this.reply = undefined}

  gotoPost(){console.log(this.reply?.id)}

  deleteReply(replyId: number): void {
    console.log('from delete reply ', replyId);
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        message: 'Are you sure you want to delete this reply?',
        id: replyId,
        obj2Del: 'reply',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      // Check the result from the confirmation modal
      if (result === true) {
        // Proceed with deleting the trill
        this.replyService.removeReply(replyId).subscribe({
          next: () => {this.toastr.success('Trill removed successfully');},
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
