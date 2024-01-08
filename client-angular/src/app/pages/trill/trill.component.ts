import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TrillCardComponent } from '../../components/trill-card/trill-card.component';
import { AccountService, TrillService } from '../../shared/services.index';
import { Reply, Trill, User } from '../../shared/models.index';
import { ReplyCardComponent } from './reply-card/reply-card.component';

@Component({
  selector: 'app-trill',
  standalone: true,
  imports: [CommonModule, FormsModule, TrillCardComponent, ReplyCardComponent],
  templateUrl: './trill.component.html',
  styleUrl: './trill.component.css'
})

export class TrillComponent {
  //@Input() trillId: number | undefined
  user: User | null = null;
  replyContent = '';
  replyImage: File | null = null;
  replyImageThumbnail: string | null = null;

  trill$: Observable<Trill> | undefined;
  replies$: Observable<Reply[]> | undefined;

  constructor(public accountService: AccountService, private trillService: TrillService, 
    private route: ActivatedRoute) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    var trillId = this.route.snapshot.paramMap.get('trillId')
    if (!trillId) return;
    this.trill$ = this.trillService.getTrillById(Number(trillId));
    this.replies$ = this.trillService.getTrillRepliesById(Number(trillId));
    console.log('replies are ', this.replies$)
  }

  createReply(trillId: number){
    // Ensure either content or image is provided
    if (!this.user || (!this.replyContent && !this.replyImage)) return; 
    
    // Check if this.trillImage is not null
    const imageToSend = this.replyImage ? this.replyImage : undefined;

    console.log('create reply pressed');
    //if(!this.trillId) return
    this.trillService.createReply(trillId, this.replyContent, imageToSend).subscribe((response) => {
      // Handle the response, e.g., show a success message or update your UI.
      console.log('Reply Created:', response);

      // Clear the trillContent and trillImage after creating the trill if needed.
      this.replyContent = '';
      this.replyImage = null;
      this.replyImageThumbnail = null;
    });
  }

  // Add the removeImage method
  removeImage(): void {
    this.replyImage = null;
    this.replyImageThumbnail = null;
  }
  
  onImageSelected(event: any): void {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      this.replyImage = selectedFile;
      this.generateThumbnail(this.replyImage); // Generate and display thumbnail
    }
  }
    
  generateThumbnail(file: File | null): void {
    const reader = new FileReader();
    if (file) {
      reader.onload = (e: any) => {
        this.replyImageThumbnail = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
    
  openImage(): void {
    if (this.replyImage) this.removeImage();
    document.getElementById('selectImage')?.click();
  }

}
