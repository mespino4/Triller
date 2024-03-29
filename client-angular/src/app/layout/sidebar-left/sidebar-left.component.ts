import {  Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { TrillModalComponent } from '../../_modals/trill-modal/trill-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, } from '@ngx-translate/core';
import { User, Member } from '../../shared/models.index';
import { AccountService, MemberService, LanguageService } from '../../shared/services.index';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HasRoleDirective, TranslateModule],
  templateUrl: './sidebar-left.component.html',
  styleUrl: './sidebar-left.component.css'
})
export class SidebarLeftComponent implements OnInit{
  member: Member | undefined;
  user: User | null = null;

  /*
  private accountService = inject(AccountService)
  private router = inject(Router)
  private memberService = inject(MemberService)
  private dialog = inject(MatDialog)
  private language = inject(LanguageService)

  */
  constructor(
    public accountService: AccountService,
    private router: Router,
    private memberService: MemberService,
    public dialog: MatDialog,
    private language: LanguageService) {}

  ngOnInit(): void {
    this.initializeUser();
    this.loadMember();
  }

  initializeUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {this.user = user;}
    });
    if(this.user)
    this.language.setCurrentLanguage(this.user.language)
  }

  loadMember(): void {
    if (!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    });
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  trill(): void {
    const dialogRef = this.dialog.open(TrillModalComponent, {
      width: '400px'
    });
  }
}