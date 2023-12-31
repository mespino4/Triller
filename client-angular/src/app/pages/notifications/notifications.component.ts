import { Component } from '@angular/core';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { take } from 'rxjs';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { CommonModule } from '@angular/common';
import { Notification } from '../../_models/notification';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NotificationCardComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  user: User | null = null;
  notifications: Notification[] | undefined
  bookmarks: number[] | undefined

  constructor(public accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadNotifications()
  }

  loadNotifications(){
    this.accountService.getNotifications().subscribe({
      next: notifications => this.notifications = notifications
    })
  }
}
