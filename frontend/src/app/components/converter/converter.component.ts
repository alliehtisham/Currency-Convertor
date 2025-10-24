import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
  currencies: string[] = [];
  fromCurrency = 'USD';
  toCurrency = 'EUR';
  amount = 1;
  result: number | null = null;
  loading = false;
  conversionType = 'latest';
  date: Date | null = null;
  displayedColumns: string[] = ['fromCurrency', 'toCurrency', 'amount', 'rate', 'result','createdAt'];
  records: any[] = [];
  tableLoading = false;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencies = this.currencyService.getCurrencies();
    const cached = localStorage.getItem('conversionRecords');
    if (cached) this.records = JSON.parse(cached);
    this.loadAllRecords();
    console.log(this.records);
  }

  convert() {
    this.loading = true;
    const obs =
      this.conversionType === 'historical'
        ? this.currencyService.convertHistorical(this.fromCurrency, this.toCurrency, this.amount, this.date?.toISOString().split('T')[0] || '')
        : this.currencyService.convertLatest(this.fromCurrency, this.toCurrency, this.amount);

    obs.subscribe({
      next: (res) => {
        this.result = res.result || 0;
        this.loading = false;
        this.loadAllRecords(true);
      },
      error: () => {
        this.result = null;
        this.loading = false;
      },
    });
  }

  loadAllRecords(updateCache: boolean = false) {
    this.tableLoading = true;
    this.currencyService.getAllConversions().subscribe({
      next: (data: any[]) => {
        this.records = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // console.log(this.records);
        if (updateCache || !localStorage.getItem('conversionRecords')) 
          localStorage.setItem('conversionRecords', JSON.stringify(this.records));
        this.tableLoading = false;
      },
      error: () => {
        const cached = localStorage.getItem('conversionRecords');
        if (cached) this.records = JSON.parse(cached);
        this.tableLoading = false;
      },
    });
  }
}
