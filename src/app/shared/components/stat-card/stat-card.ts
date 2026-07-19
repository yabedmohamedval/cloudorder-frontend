import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {

  @Input({ required: true })
  title = '';

  @Input({ required: true })
  value: string | number = '';

  @Input({ required: true })
  icon = '';

  @Input()
  hint = '';

}
