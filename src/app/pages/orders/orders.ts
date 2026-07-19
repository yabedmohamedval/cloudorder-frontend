import { CommonModule } from '@angular/common';

import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import {
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import {
  MatSort,
  MatSortModule
} from '@angular/material/sort';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  Order,
  OrderRequest
} from '../../models/order';

import { OrderService } from '../../services/order.service';

import {
  ConfirmationDialog
} from '../../shared/components/confirmation-dialog/confirmation-dialog';

import {
  EmptyState
} from '../../shared/components/empty-state/empty-state';

import {
  OrderFormDialog
} from './order-form-dialog/order-form-dialog';

type PriceRange =
  | 'ALL'
  | 'UNDER_500'
  | 'BETWEEN_500_1000'
  | 'OVER_1000';

interface OrderFilter {
  search: string;
  priceRange: PriceRange;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    EmptyState
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator)
  paginator?: MatPaginator;

  @ViewChild(MatSort)
  sort?: MatSort;

  private readonly orderService = inject(OrderService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly displayedColumns = [
    'id',
    'productName',
    'quantity',
    'price',
    'total',
    'createdAt',
    'actions'
  ];

  readonly dataSource =
    new MatTableDataSource<Order>([]);

  loading = true;
  searchTerm = '';
  priceRange: PriceRange = 'ALL';

  readonly priceRanges = [
    {
      value: 'ALL' as PriceRange,
      label: 'All prices'
    },
    {
      value: 'UNDER_500' as PriceRange,
      label: 'Under 500 €'
    },
    {
      value: 'BETWEEN_500_1000' as PriceRange,
      label: '500 € to 1,000 €'
    },
    {
      value: 'OVER_1000' as PriceRange,
      label: 'Over 1,000 €'
    }
  ];

  ngOnInit(): void {
    this.configureFilter();
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  loadOrders(): void {
    this.loading = true;

    this.orderService.getOrders().subscribe({
      next: orders => {
        this.dataSource.data = orders;
        this.loading = false;
      },
      error: error => {
        console.error(error);
        this.loading = false;

        this.showMessage(
          'Unable to load orders.',
          'Close'
        );
      }
    });
  }

  applyFilters(): void {
    const filter: OrderFilter = {
      search: this.searchTerm.trim().toLowerCase(),
      priceRange: this.priceRange
    };

    this.dataSource.filter = JSON.stringify(filter);
    this.dataSource.paginator?.firstPage();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.priceRange = 'ALL';
    this.applyFilters();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(OrderFormDialog, {
      width: '580px',
      maxWidth: '95vw',
      data: {}
    });

    dialogRef.afterClosed().subscribe(
      (payload?: OrderRequest) => {
        if (!payload) {
          return;
        }

        this.orderService.createOrder(payload).subscribe({
          next: () => {
            this.showMessage(
              'Order created successfully.',
              'Close'
            );

            this.loadOrders();
          },
          error: error => {
            console.error(error);

            this.showMessage(
              'Unable to create the order.',
              'Close'
            );
          }
        });
      }
    );
  }

  openEditDialog(order: Order): void {
    const dialogRef = this.dialog.open(OrderFormDialog, {
      width: '580px',
      maxWidth: '95vw',
      data: { order }
    });

    dialogRef.afterClosed().subscribe(
      (payload?: OrderRequest) => {
        if (!payload) {
          return;
        }

        this.orderService
          .updateOrder(order.id, payload)
          .subscribe({
            next: () => {
              this.showMessage(
                'Order updated successfully.',
                'Close'
              );

              this.loadOrders();
            },
            error: error => {
              console.error(error);

              this.showMessage(
                'Unable to update the order.',
                'Close'
              );
            }
          });
      }
    );
  }

  confirmDelete(order: Order): void {
    const dialogRef = this.dialog.open(
      ConfirmationDialog,
      {
        width: '460px',
        maxWidth: '95vw',
        data: {
          title: 'Delete order',
          message:
            `Are you sure you want to delete "${order.productName}"?`,
          confirmText: 'Delete',
          cancelText: 'Cancel'
        }
      }
    );

    dialogRef.afterClosed().subscribe(
      confirmed => {
        if (confirmed) {
          this.deleteOrder(order.id);
        }
      }
    );
  }

  private deleteOrder(id: number): void {
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.showMessage(
          'Order deleted successfully.',
          'Close'
        );

        this.loadOrders();
      },
      error: error => {
        console.error(error);

        this.showMessage(
          'Unable to delete the order.',
          'Close'
        );
      }
    });
  }

  private configureFilter(): void {
    this.dataSource.filterPredicate = (
      order: Order,
      serializedFilter: string
    ): boolean => {

      const filter =
        JSON.parse(serializedFilter) as OrderFilter;

      const searchableText = [
        order.id,
        order.productName,
        order.quantity,
        order.price
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        searchableText.includes(filter.search);

      const total = order.quantity * order.price;

      const matchesPrice =
        filter.priceRange === 'ALL' ||
        (
          filter.priceRange === 'UNDER_500' &&
          total < 500
        ) ||
        (
          filter.priceRange === 'BETWEEN_500_1000' &&
          total >= 500 &&
          total <= 1000
        ) ||
        (
          filter.priceRange === 'OVER_1000' &&
          total > 1000
        );

      return matchesSearch && matchesPrice;
    };
  }

  private showMessage(
    message: string,
    action: string
  ): void {
    this.snackBar.open(message, action, {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}