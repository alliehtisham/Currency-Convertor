import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrencies(): string[] {
    return ['USD', 'EUR', 'JPY', 'BGN', 'CZK', 'DKK', 'GBP', 'HUF', 'PLN', 'AUD', 'CAD', 
      'INR', 'MYR'
    ];
  }

  convertLatest(from: string, to: string, amount: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/convertor`, {
      fromCurrency: from,
      toCurrency: to,
      amount,
    });
  }

  convertHistorical(from: string, to: string, amount: number, date: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/convertor`, {
      fromCurrency: from,
      toCurrency: to,
      amount,
      conversionDate: date,
    });
  }

  getAllConversions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/convertor`);
  }
}
