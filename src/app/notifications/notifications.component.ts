import { Component, OnInit } from '@angular/core';
import { StompService } from '../services/stomp.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [MatMenuModule, MatListModule, CommonModule],
})
export class NotificationsComponent implements OnInit {
  notifications: string[] = [];

  constructor(private stompService: StompService) {}

  ngOnInit(): void {
    // Récupère les notifications à chaque fois qu'elles arrivent
    this.stompService.getNotifications().subscribe((notifications: string[]) => {
      this.notifications = notifications;
    });
  }
}
