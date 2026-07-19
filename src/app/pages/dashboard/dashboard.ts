import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { RouterLink } from '@angular/router';

import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { StatCard } from '../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    StatCard
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private readonly orderService = inject(OrderService);

  orders: Order[] = [];
  loading = true;
  errorMessage = '';

  displayedColumns = [
    'productName',
    'quantity',
    'price',
    'total'
  ];

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: orders => {
        this.orders = orders;
        this.loading = false;
      },
      error: error => {
        console.error(error);
        this.errorMessage = 'Unable to load dashboard information.';
        this.loading = false;
      }
    });
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get totalQuantity(): number {
    return this.orders.reduce(
      (sum, order) => sum + order.quantity,
      0
    );
  }

  get totalValue(): number {
    return this.orders.reduce(
      (sum, order) => sum + order.quantity * order.price,
      0
    );
  }

  get averageValue(): number {
    if (this.orders.length === 0) {
      return 0;
    }

    return this.totalValue / this.orders.length;
  }

  get recentOrders(): Order[] {
    return [...this.orders]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  }

}
