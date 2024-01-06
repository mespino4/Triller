import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Member, User } from '../../../shared/models.index';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AccountService, AdminService } from '../../../shared/services.index';
import { EditRolesModalComponent } from '../../../_modals/edit-roles-modal/edit-roles-modal.component';

@Component({
  selector: 'app-user-management-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management-card.component.html',
  styleUrl: './user-management-card.component.css'
})
export class UserManagementCardComponent {
  @Input() member: Member | undefined
  @Input() user: User | null = null;

  availableRoles = [
    'Admin',
    'Moderator',
    'Member'
  ]

  constructor( private adminService: AdminService, public dialog: MatDialog,
    private toastr: ToastrService, public accountService: AccountService) {}

  ngOnInit(): void {
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
      console.log('The dialog was closed');
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
