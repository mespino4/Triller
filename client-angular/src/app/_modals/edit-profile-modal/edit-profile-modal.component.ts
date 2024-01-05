import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Member, User } from '../../shared/models.index';
import { MemberService } from '../../_services/member.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css'
})
export class EditProfileModalComponent {
  @ViewChild('editForm') editForm: NgForm | undefined;
  member: Member | undefined;
  profilePic: File | null = null;
  bannerPic: File | null = null;
  profilePreview: string | null = null;
  bannerPreview: string | null = null;
  originalMemberData: Member | undefined;

  constructor(
    private dialogRef: MatDialogRef<EditProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: Member },
    private memberService: MemberService,
    private toastr: ToastrService) {
    this.member = data.member;
    this.originalMemberData = { ...data.member };
  }

  ngOnInit() {this.member = this.data?.member;}

  openFileInput(inputId: string){document.getElementById(inputId)?.click();}

  fileSelected(event: any, fileType: string): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (fileType === 'profile') {
        this.profilePic = selectedFile;
        this.generatePreview(this.profilePic, result => this.profilePreview = result);
      } else if (fileType === 'banner') {
        this.bannerPic = selectedFile;
        this.generatePreview(this.bannerPic, result => this.bannerPreview = result);
      }
    }
  }

  uploadFile(file: File | null): void {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.memberService.updateProfilePic(formData).subscribe({
        next: (data) => console.log('Success:', data),
        error: (error) => console.error('Error:', error),
      });
    }
  }

  uploadFiles(): void {
    this.uploadFile(this.profilePic);
    this.uploadFile(this.bannerPic);
  }

  updateProfile() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: (_) => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      },
      complete: () => {this.uploadFiles();},
    });
    this.dialogRef.close();
  }

  generatePreview(file: File | null, callback: (result: string) => void): void {
    const reader = new FileReader();
    if (file) {
      reader.onload = (e: any) => {
        callback(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  close() {
    if (this.editForm && this.originalMemberData) {
      this.editForm.reset(this.originalMemberData);
    }

    if (this.dialogRef) {this.dialogRef.close();}
  }
}