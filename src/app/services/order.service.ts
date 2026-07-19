import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderRequest } from '../models/order';


@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private api = 'https://cloudorder-api-319772564252.europe-west1.run.app/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(this.api);

  }
  
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.api}/${id}`);
  }

  createOrder(order: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.api, order);
  }

  updateOrder(id: number, order: OrderRequest): Observable<Order> {
    return this.http.put<Order>(`${this.api}/${id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
