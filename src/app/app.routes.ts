import { Routes } from '@angular/router';

import {
  MainLayout
} from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(module => module.Dashboard)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/orders')
            .then(module => module.Orders)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];