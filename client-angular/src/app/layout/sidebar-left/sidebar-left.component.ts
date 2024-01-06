import { Component, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../_models/user';
import { MemberService } from '../../_services/member.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { TrillModalComponent } from '../../_modals/trill-modal/trill-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HasRoleDirective],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.css'
})
export class SidebarLeftComponent implements OnInit{
  model = {};

  member: Member | undefined;
  user: User | null = null;

  constructor(public accountService: AccountService, private router: Router, 
    private memberService: MemberService, public dialog: MatDialog) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    if(!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    });
  }
  
  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members');
        this.model = {}
      }
    })
  }

  // Function to log the user out.
  logout() {
    this.accountService.logout(); // Call the logout function from the AccountService.
    this.router.navigateByUrl('/')
  }

  trill() {
    const dialogRef = this.dialog.open(TrillModalComponent, {
      width: '400px',
    });
  }
}