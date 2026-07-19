import {
  Component,
  EventEmitter,
  Output
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  @Output()
  navigation = new EventEmitter<void>();

  navigate(): void {
    this.navigation.emit();
  }

}
