import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, filter, of, switchMap, take } from 'rxjs';
import { Trill } from '../../_models/trill';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrillCardComponent } from '../../components/trill-card/trill-card.component';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { AccountService, MemberService, BlockService } from '../../shared/services.index';
import { User, Member } from '../../shared/models.index';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TrillCardComponent, ProfileHeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  member: Member = {} as Member;
  trills$: Observable<Trill[]> | undefined;

  isMemberBlocked: boolean | null = null;
  isUserBlocked: boolean | null = null;
  user: User | null = null;

  private memberService = inject(MemberService)
  private accountService = inject(AccountService)
  private blockService = inject(BlockService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  ngOnInit(): void {
    this.initializeUser();
    this.subscribeToUrlChanges();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.trills$ = undefined;
    this.isMemberBlocked = null;
    this.isUserBlocked = null;
  }
  

  private initializeUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    });
  }

  private subscribeToUrlChanges(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.reloadUserTimeline());
  }

  private async loadData(): Promise<void> {
    this.route.data.subscribe(data => {
      this.member = data['member'];
    });

    this.getMemberBlockStatus(this.member);
    this.getUserBlockStatus(this.member);
    this.trills$ = this.memberService.getTimeline(this.member.username);
  }

  private getMemberBlockStatus(member: Member): void {
    this.blockService.getMemberBlockStatus(member.id).subscribe({
      next: response => this.isMemberBlocked = response
    });
  }

  private getUserBlockStatus(member: Member): void {
    this.blockService.getUserBlockStatus(member.id).subscribe({
      next: response => this.isUserBlocked = response
    });
  }

  private async reloadUserTimeline(): Promise<void> {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.trills$ = this.memberService.getTimeline(username);
    }
  }

  getFollowing(): void {
    this.memberService.getConnections('following').subscribe({
      next: response =>  {
        if(Array.isArray(response) && response.length > 0){
          this.accountService.following = response.map(item => item.id)
        }
      }
    });
  }
}