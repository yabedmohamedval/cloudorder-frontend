import { 
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  MatSidenav,
  MatSidenavModule
} from '@angular/material/sidenav';

import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    Sidebar,
    Topbar
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {

  @ViewChild('drawer')
  private drawer?: MatSidenav;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  isMobile = false;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.Handset,
        Breakpoints.TabletPortrait
      ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  toggleMenu(): void {
    this.drawer?.toggle();
  }

  closeMenuOnMobile(): void {
    if (this.isMobile) {
      this.drawer?.close();
    }
  }

}
