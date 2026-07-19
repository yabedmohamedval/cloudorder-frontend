import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  Order,
  OrderRequest
} from '../../../models/order';

export interface OrderFormDialogData {
  order?: Order;
}

@Component({
  selector: 'app-order-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './order-form-dialog.html',
  styleUrl: './order-form-dialog.css',
})
export class OrderFormDialog {

  private readonly formBuilder = inject(FormBuilder);


  private readonly dialogRef:
    MatDialogRef<OrderFormDialog, OrderRequest> =
      inject(MatDialogRef);

  readonly data =
    inject<OrderFormDialogData>(MAT_DIALOG_DATA);

  readonly form = this.formBuilder.nonNullable.group({
    productName: [
      this.data.order?.productName ?? '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(120)
      ]
    ],

    quantity: [
      this.data.order?.quantity ?? 1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    price: [
      this.data.order?.price ?? 0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ]
  });

  get isEditMode(): boolean {
    return Boolean(this.data.order);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

}
