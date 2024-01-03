import { Component } from '@angular/core';
import { ConnectionCardComponent } from './connection-card/connection-card.component';
import { Member } from '../../_models/member';
import { MemberService } from '../../_services/member.service';
import { AccountService } from '../../_services/account.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-connections',
  standalone: true,
  imports: [ConnectionCardComponent, CommonModule, RouterModule],
  templateUrl: './connections.component.html',
  styleUrl: './connections.component.css'
})
export class ConnectionsComponent {
  members: Member[] | undefined;
  isFollowing = true

  followers: Member[] = []; // Define an array to store followers
  following: Member[] = []; // Define an array to store following
  followerId: number[] = []

  constructor( private memberService: MemberService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadFollowers('following')
  }

  loadFollowers(predicate: string){
    this.memberService.getConnections(predicate).subscribe({
      next: response =>  {
        this.members = response
      }
    })
  }

  followersToggle(){
    this.isFollowing = false
    this.loadFollowers('followers')
  }
  followingToggle(){
    this.isFollowing = true
    this.loadFollowers('following')
  }
}
