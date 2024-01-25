import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../_models/user';
import { TranslateModule } from '@ngx-translate/core';
import { EditRolesModalComponent } from '../../_modals/edit-roles-modal/edit-roles-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { LanguageService, AdminService } from '../../shared/services.index';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private adminService = inject(AdminService)
  private dialog = inject(MatDialog)
  private language = inject(LanguageService)
  
  selectedLanguage: string = this.language.getCurrentLanguage();
  users: User[] = []

  /*
  availableRoles = [
    this.language.getTranslation('admin','admin'),
    this.language.getTranslation('admin','moderator'),
    this.language.getTranslation('admin','member')
  ]
  */
  
  availableRoles = [
    'Admin',
    'Moderator',
    'Member'
  ]
  
  ngOnInit(): void {
    this.adminService.getUsersWithRoles().subscribe({
      next: members => this.users = members
    })
  }

  openModal(user: User): void {
    const dialogRef = this.dialog.open(EditRolesModalComponent, {
      width: '400px',
      data: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles],
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedRoles = result.selectedRoles;
        if (!this.objectEqual(selectedRoles, user.roles)) {
          this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
            next: (roles) => (user.roles = roles),
          });
        }
      }
    });
  }
  
  private objectEqual(obj1: any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

}
