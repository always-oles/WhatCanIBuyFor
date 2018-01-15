import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Product } from '../interfaces';

interface Item {
  title:  String;
  amount: Number;
  price:  Number;
}

@Component({
  selector: 'app-recent-options',
  templateUrl: './recent-options.component.html',
  styleUrls: ['./recent-options.component.sass']
})
export class RecentOptionsComponent implements OnInit {
  public betterOptions: any = [];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    // request a better options array
    this.dataService
      .requestBetterOptions()
      .subscribe(betterOptions => this.betterOptions = this.remapBetterOptions(betterOptions));
  }

  /**
   * Remap better options as we wish
   */
  private remapBetterOptions(betterOptions) {
    betterOptions = betterOptions.map(item => {

      // generate random product amount
      const randomAmount = Math.floor(Math.random() * 10 + 1);

      return {
        title: item.title,
        price: Math.round(randomAmount * item.price),
        amount: randomAmount,
        currency: item.currency
      };

    });

    console.log(betterOptions);

    return betterOptions;
  }

}
