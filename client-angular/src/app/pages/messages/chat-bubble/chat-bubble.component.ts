import { Component, Input, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Message } from '../../../_models/message';
import { User } from '../../../_models/user';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../../_modals/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { LanguageService, MessageService, AccountService} from '../../../shared/services.index';

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.css'
})
export class ChatBubbleComponent {
  private accountService = inject(AccountService)
  public messageService = inject(MessageService)
  private languageService = inject(LanguageService)
  public toastr = inject(ToastrService)
  private dialog = inject(MatDialog)

  @Input() message: Message | undefined;
  currentUser?: User | null = null;
  isSender: boolean | undefined;
  isHovered = false;
  language: string = this.languageService.getCurrentLanguage();
  isMsgDestroyed: boolean = false;

  ngOnInit(): void {
    this.setupCurrentUser()
  }

  toggleHover(state: boolean) {
    this.isHovered = state;
  }

  setupCurrentUser(){
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.currentUser = user})

    if(this.currentUser?.username == this.message?.senderUsername){
      this.isSender = true;
    }
  }

  deleteMessage(messageId: number): void {
    let msg: string;

    switch (this.language) {
      case 'en':
        msg = 'Are you sure you want to delete this message?';
        break;
      case 'es':
        msg = '¿Estás seguro de que quieres eliminar este mensaje?';
        break;
      default:
        msg = 'Are you sure you want to delete this message?';
    }
    console.log("language is ", this.language)

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {message: msg},
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.messageService.deleteMessage(messageId).subscribe({
          next: () => {
            this.toastr.success('Mesage removed successfully');
            this.isMsgDestroyed = true
          },error: (error) => {this.toastr.error('Error removing Message');},
        })
      }
    });
  }  
}
