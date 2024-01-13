import { Component, Input, inject } from '@angular/core';
import { Member, Reply, User } from '../../../shared/models.index';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../../_modals/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountService, LanguageService, 
        MemberService, ReplyService } from '../../../shared/services.index';

@Component({
  selector: 'app-reply-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reply-card.component.html',
  styleUrl: './reply-card.component.css'
})
export class ReplyCardComponent {
  private memberService = inject(MemberService)
  private replyService = inject(ReplyService)
  private languageService = inject(LanguageService)
  private accountService = inject(AccountService)
  private dialog = inject(MatDialog)

  @Input() reply: Reply | undefined;
  member$: Member| undefined
  isLike: boolean = false
  isDislike: boolean = false
  user: User | null = null;

  localTimestamp: string | undefined

  isReplyDestroyed: boolean = false;

  language: string = this.languageService.getCurrentLanguage();
  isMsgDestroyed: boolean = false;
    
  ngOnInit(): void {
    this.getReplyReaction()
    this.loadMember()
    this.setupUser()
  }

  setupUser(){
    if(this.reply){
      this.memberService.getMemberById(this.reply?.authorId).pipe(take(1)).subscribe({
        next: member => this.member$ = member
      });
    }

    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })  
  }

  like(replyId: number) {
    this.replyService.likeReply(replyId).subscribe({
      next: () => {
        if(this.isLike){ //if its already liked
          this.isLike = false
          this.reply!.likes--;
        }else if(this.isDislike){ //if its already disliked
          this.isDislike = false
          this.isLike = true
          this.reply!.likes++;
          this.reply!.dislikes--;
        }else{
          this.isLike = true
          this.isDislike = false
          this.reply!.likes++;
        }
      },error: (err) => {console.error('Error liking reply', err);},
    });
  }

  dislike(replyId: number) {
    this.replyService.dislikeReply(replyId).subscribe({
      next: () => {
        if(this.isDislike){ //if its already disliked
          this.isDislike = false
          this.reply!.dislikes--;
        }else if(this.isLike){ //if its already liked
          this.isLike = false
          this.isDislike = true
          this.reply!.likes--;
          this.reply!.dislikes++;
        }else{
          this.isLike = false
          this.isDislike = true
          this.reply!.dislikes++;
        }
      },error: (err) => {console.error('Error disliking reply', err);},
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

  loadMember() {
    if(this.reply)
      this.memberService.getMemberById(this.reply?.authorId).subscribe({
        next: member => this.member$ = member
      });
  }

  ngOnDestroy(): void {this.reply = undefined}

  deleteReply(replyId: number): void {
    let msg: string;

    switch (this.language) {
      case 'en':
        msg = 'Are you sure you want to delete this reply?';
        break;
      case 'es':
        msg = '¿Estás seguro de que quieres eliminar este respuesta?';
        break;
      default:
        msg = 'Are you sure you want to delete this reply?';
    }
    console.log("language is ", this.language)

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {message: msg},
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.replyService.removeReply(replyId).subscribe({
          next: () => {this.isReplyDestroyed = true;},
          error: (error) => {console.error('Error:', error);},
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
