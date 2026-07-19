import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {

  @Input()
  showMenuButton = false;

  @Output()
  menuClick = new EventEmitter<void>();

}
