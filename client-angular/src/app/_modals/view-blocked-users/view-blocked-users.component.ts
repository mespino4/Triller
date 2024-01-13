import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlockService } from '../../_services/block.service';
import { Member } from '../../shared/models.index';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-view-blocked-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './view-blocked-users.component.html',
  styleUrl: './view-blocked-users.component.css'
})
export class ViewBlockedUsersComponent {
  members: Member[] | undefined;
  blockStatusMap: Map<number, boolean> = new Map<number, boolean>();

  constructor(
    public dialogRef: MatDialogRef<ViewBlockedUsersComponent>,
    private blockService: BlockService,
    @Inject(MAT_DIALOG_DATA) public data: { members: Member[] }
  ) {}

  ngOnInit() {
    this.members = this.data?.members;

    // Initialize block status map
    if (this.members) {
      this.members.forEach((member) => {
        this.getMemberBlockStatus(member.id).subscribe((isBlocked: boolean) => {
          this.blockStatusMap.set(member.id, isBlocked);
        });
      });
    }
  }

  getMemberBlockStatus(memberId: number): Observable<boolean> {
    return this.blockService.getMemberBlockStatus(memberId);
  }

  toggleBlockStatus(memberId: number) {
    const currentStatus = this.blockStatusMap.get(memberId) || false;

    if (currentStatus) {
      this.unblock(memberId);
    } else {
      this.block(memberId);
    }
  }

  ok(){
    this.dialogRef.close(true);
  }

  unblock(memberId: number) {
    this.blockService.unblock(memberId).subscribe((isUnblocked: boolean) => {
      // Handle the result if needed
      console.log('Is unblocked:', isUnblocked);
      this.blockStatusMap.set(memberId, false);
    });
  }

  block(memberId: number) {
    this.blockService.block(memberId).subscribe((isBlocked: boolean) => {
      // Handle the result if needed
      console.log('Is blocked:', isBlocked);
      this.blockStatusMap.set(memberId, true);
    });
  }
}