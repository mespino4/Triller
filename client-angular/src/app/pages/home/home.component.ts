import { Component } from '@angular/core';
import { User } from '../../_models/user';
import { Trill } from '../../_models/trill';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TrillService } from '../../_services/trill.service';
import { Pagination } from '../../_models/pagination';
import { FormsModule } from '@angular/forms';
import { TrillCardComponent } from '../../components/trill-card/trill-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, TrillCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  user: User | null = null;
  //trills$: Observable<Trill[]> | undefined;
  trills: Trill[] =  [];

  pagination: Pagination | undefined
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;

  trillContent = '';
  trillImage: File | null = null;
  trillImageThumbnail: string | null = null;

  constructor(public accountService: AccountService, //private bookmarkService: BookmarksService, 
    private trillService: TrillService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadTrills();
  }

  loadTrills() {
    this.trillService.getTrills(this.pageNumber, this.pageSize).subscribe({
      next: response => {
        if (response.result && response.pagination) {
          // Concatenate the new trills with the existing ones
          this.trills = this.trills.concat(response.result); //use the line below for a more modern aproach
          //this.trills = [...this.trills, ...response.result]; //this is a more modern aproach
          this.pagination = response.pagination;
          this.totalPages = response.pagination.totalPages;
        }
      }
    });
  }
  
  loadMoreTrills() {
    this.pageNumber++;
    this.loadTrills()
  }

  ngOnDestroy(): void {
    this.trillService.destroyTrills();
  }

  // Update the createTrill method to handle the case where only content is provided
  createTrill() {
    if (!this.user || (!this.trillContent && !this.trillImage)) {
      // Ensure either content or image is provided
      return;
    }

    // Check if this.trillImage is not null
    const imageToSend = this.trillImage ? this.trillImage : undefined;

    this.trillService.createTrill(this.trillContent, imageToSend).subscribe((response) => {
      // Handle the response, e.g., show a success message or update your UI.
      console.log('Trill created:', response);

      // Clear the trillContent and trillImage after creating the trill if needed.
      this.trillContent = '';
      this.trillImage = null;
      this.trillImageThumbnail = null;
    });

    this.loadTrills();
  }

  removeImage(): void {
    this.trillImage = null;
    this.trillImageThumbnail = null;
  }

  onImageSelected(event: any): void {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      this.trillImage = selectedFile;
  
      // Generate and display thumbnail
      this.generateThumbnail(this.trillImage);
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
    document.getElementById('selectImage')?.click();
  }
}
