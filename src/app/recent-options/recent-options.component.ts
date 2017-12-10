import { Component, OnInit } from '@angular/core';

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
  recentOptions: Array<Item> = [
    {
      title: 'Test item 1',
      amount: Math.floor(Math.random() * 10 + 1),
      price: Math.floor(Math.random() * 1000 + 100)
    },
    {
      title: 'Test item 2',
      amount: Math.floor(Math.random() * 10 + 1),
      price: Math.floor(Math.random() * 1000 + 100)
    },
    {
      title: 'Test item 3',
      amount: Math.floor(Math.random() * 10 + 1),
      price: Math.floor(Math.random() * 1000 + 100)
    },
    {
      title: 'Test item 4',
      amount: Math.floor(Math.random() * 10 + 1),
      price: Math.floor(Math.random() * 1000 + 100)
    }
  ];

  constructor() {

  }

  ngOnInit() {
  }

}
