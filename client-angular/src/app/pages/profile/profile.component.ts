import { Component } from '@angular/core';
import { Member } from '../../_models/member';
import { Observable, take } from 'rxjs';
import { Trill } from '../../_models/trill';
import { User } from '../../_models/user';
import { MemberService } from '../../_services/member.service';
import { AccountService } from '../../_services/account.service';
import { TrillService } from '../../_services/trill.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockService } from '../../_services/block.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrillCardComponent } from '../../components/trill-card/trill-card.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, TrillCardComponent, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  member: Member = {} as Member;
  trills$: Observable<Trill[]> | undefined;

  isMemberBlocked: boolean | null = null;
  isUserBlocked: boolean | null = null;
  user: User | null = null;

  constructor(private memberService: MemberService, private route: ActivatedRoute, private router: Router,
    private accountService: AccountService, private trillService: TrillService, private blockService: BlockService) {
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next: user => this.user = user
    })

    var username = this.route.snapshot.paramMap.get('username')
    if (!username) return;
    this.trills$ = this.memberService.getTimeline(username)
  }

  async ngOnInit(): Promise<void> {
    this.route.data.subscribe(data => {
      this.member = data['member'];
    })
    this.getMemberBlockStatus(this.member)
    this.getUserBlockStatus(this.member)
  }
  
  getFollowing(){
    this.memberService.getConnections('following').subscribe({
      next: response =>  {
        if(Array.isArray(response) && response.length > 0){
          this.accountService.following = response.map(item => item.id)
        }
      }
    });
  }

  getMemberBlockStatus(member: Member){
    this.blockService.getMemberBlockStatus(member.id).subscribe({
      next: response => this.isMemberBlocked = response
    })
  }
  
  getUserBlockStatus(member: Member){
    this.blockService.getUserBlockStatus(member.id).subscribe({
      next: response => this.isUserBlocked = response
    })
  }

  ngOnDestroy(): void {
    console.log('trills destroyed')
    this.trills$ = undefined;
    this.trillService.destroyUserTrills()
  }
}
