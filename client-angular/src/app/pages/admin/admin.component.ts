import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserManagementCardComponent } from './user-management-card/user-management-card.component';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, UserManagementCardComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: User[] = []

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.adminService.getUsersWithRoles().subscribe({
      next: members => this.users = members
    })
  }

}
