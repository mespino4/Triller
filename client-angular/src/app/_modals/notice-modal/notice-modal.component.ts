import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-notice-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './notice-modal.component.html',
  styleUrl: './notice-modal.component.css'
})
export class NoticeModalComponent {
  private dialogRef = inject(MatDialogRef<NoticeModalComponent>)

  ok(){this.dialogRef.close(true);}

}
