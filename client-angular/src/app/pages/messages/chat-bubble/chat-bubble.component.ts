import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../_services/account.service';
import { MessageService } from '../../../_services/message.service';
import { take } from 'rxjs';
import { Message } from '../../../_models/message';
import { User } from '../../../_models/user';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../../_modals/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.css'
})
export class ChatBubbleComponent {
  @Input() message: Message | undefined;
  currentUser?: User | null = null;
  isSender: boolean | undefined;
  isHovered = false;

  constructor(private accountService: AccountService, public messageService: MessageService, 
    private toastr: ToastrService, public dialog: MatDialog){
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.currentUser = user
    })
  }

  ngOnInit(): void {
    if(this.currentUser?.username == this.message?.senderUsername){
      this.isSender = true;
    }
  }

  toggleHover(state: boolean) {
    this.isHovered = state;
  }

  
  deleteMessage(messageId: number): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        message: 'Are you sure you want to delete this message?',
        id: messageId,
        //obj2Del: 'message',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      // Check the result from the confirmation modal
      if (result === true) {
        // Proceed with deleting the trill
        this.messageService.deleteMessage(messageId).subscribe({
          next: () => {
            this.toastr.success('Mesage removed successfully');
          },
          error: (error) => {
            console.error('Error:', error);
            this.toastr.error('Error removing Message');
          },
        })
      }
    });
  }

  
}
