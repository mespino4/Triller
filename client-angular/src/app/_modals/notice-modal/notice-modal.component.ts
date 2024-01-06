import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notice-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notice-modal.component.html',
  styleUrl: './notice-modal.component.css'
})
export class NoticeModalComponent {
  //msg: string | undefined;

  //private dialogRef = Inject(MatDialogRef<NoticeModalComponent>)
  //@Inject(MAT_DIALOG_DATA) public data: { message: string; } | undefined 

  constructor(public dialogRef: MatDialogRef<NoticeModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { message: string }) { }


  ok(){
    this.dialogRef.close(true);
  }

}
