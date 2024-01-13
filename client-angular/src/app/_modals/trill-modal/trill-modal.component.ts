import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrillService } from '../../_services/trill.service';
import { User } from '../../_models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { AccountService } from '../../shared/services.index';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-trill-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './trill-modal.component.html',
  styleUrl: './trill-modal.component.css'
})
export class TrillModalComponent {
  user: User | null = null;
  trillContent = '';
  trillImage: File | null = null;
  trillImageThumbnail: string | null = null;
  

  constructor(public accountService: AccountService,
    private trillService: TrillService, public dialogRef: MatDialogRef<TrillModalComponent>) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  cancel(){
    this.dialogRef.close();
  }

  trill() {
    if (!this.user || (!this.trillContent && !this.trillImage)) return;
  
    // Check if this.trillImage is not null
    const imageToSend = this.trillImage ? this.trillImage : undefined;
  
    // Only create trill if either trillContent or trillImage is present
    if (this.trillContent || this.trillImage) {
      this.trillService.createTrill(this.trillContent, imageToSend).subscribe((response) => {  
        // Clear the trillContent and trillImage after creating the trill if needed.
        this.trillContent = '';
        this.trillImage = null;
        this.trillImageThumbnail = null;
  
        // Reload trills after creation
        //this.loadTrills();
        
      });
    }
    this.dialogRef.close();
  }

  removeImage(): void {
    this.trillImage = null;
    this.trillImageThumbnail = null;
  }

  onImageSelected(event: any): void {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      this.trillImage = selectedFile;
      this.generateThumbnail(this.trillImage); // Generate and display thumbnail
    }
  }
  
  generateThumbnail(file: File | null): void {
    const reader = new FileReader();
    if (file) {
      reader.onload = (e: any) => {
        this.trillImageThumbnail = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  openImage(): void {
    if (this.trillImage) this.removeImage();
    document.getElementById('selectImage')?.click();
  }
}
