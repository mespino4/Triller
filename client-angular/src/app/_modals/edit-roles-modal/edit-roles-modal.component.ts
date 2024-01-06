import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-roles-modal',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule],
  templateUrl: './edit-roles-modal.component.html',
  styleUrl: './edit-roles-modal.component.css'
})
export class EditRolesModalComponent {
  username = '';
  availableRoles: any[] = []
  selectedRoles: any[] = []

  constructor(
    public dialogRef: MatDialogRef<EditRolesModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.username = data.username;
    this.availableRoles = data.availableRoles;
    this.selectedRoles = Array.isArray(data.selectedRoles) ? [...data.selectedRoles] : [];
  }

  updateChecked(checkedValue: string): void {
    const index = this.selectedRoles.indexOf(checkedValue);
    index !== -1 ? this.selectedRoles.splice(index, 1) : this.selectedRoles.push(checkedValue);
  }

  close(): void {
    this.dialogRef.close({ selectedRoles: this.selectedRoles });
  }
}
