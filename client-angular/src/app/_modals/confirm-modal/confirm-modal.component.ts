import { Component, Inject } from '@angular/core';
import { TrillService } from '../../_services/trill.service';
import { ToastrService } from 'ngx-toastr';
import { ReplyService } from '../../_services/reply.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  id: number | undefined;
  obj2Del: string | undefined;

  constructor(private trillService: TrillService, private toastr: ToastrService, private replyService: ReplyService,
    public dialogRef: MatDialogRef<ConfirmModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    console.log(this.id)
    if(this.obj2Del == 'user' && this.id){
      this.deleteUser(this.id);
    }else if(this.obj2Del == 'trill' && this.id){
      this.deleteTrill(this.id)
    }else if(this.obj2Del == 'reply' && this.id){
      this.deleteReply(this.id)
    }

    this.dialogRef.close(true);
  }

  deleteUser(userId: number){
    console.log('user deleted')
  }

  deleteTrill(trillId: number){
    this.trillService.deleteTrill(trillId).subscribe({
      next: () => {
        this.toastr.success('Trill removed successfully');
      },
      error: (error) => {
        console.error('Error:', error);
        this.toastr.error('Error removing trill');
      }
    });
  }

  deleteReply(replyId: number){
    this.replyService.removeReply(replyId).subscribe({
      next: () => {
        this.toastr.success('reply removed successfully');
      },
      error: (error) => {
        console.error('Error:', error);
        this.toastr.error('Error removing reply');
      }
    });
  }
}
