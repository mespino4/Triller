import { Component } from '@angular/core';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrillCardComponent } from '../../components/trill-card/trill-card.component';
import { TrillService, AccountService, BookmarkService } from '../../shared/services.index';
import { Pagination, User, Trill} from '../../shared/models.index';

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

  constructor(public accountService: AccountService, private bookmarkService: BookmarkService, 
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

  createTrill() {
    if (!this.user || (!this.trillContent && !this.trillImage)) return;
  
    // Check if this.trillImage is not null
    const imageToSend = this.trillImage ? this.trillImage : undefined;
  
    // Only create trill if either trillContent or trillImage is present
    if (this.trillContent || this.trillImage) {
      this.trillService.createTrill(this.trillContent, imageToSend).subscribe((response) => {
        // Handle the response, e.g., show a success message or update your UI.
        console.log('Trill created:', response);
  
        // Clear the trillContent and trillImage after creating the trill if needed.
        this.trillContent = '';
        this.trillImage = null;
        this.trillImageThumbnail = null;
  
        // Reload trills after creation
        this.loadTrills();
      });
    }
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
