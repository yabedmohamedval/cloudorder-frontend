import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';


@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private api = 'https://cloudorder-api-319772564252.europe-west1.run.app/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(this.api);

  }  
}
