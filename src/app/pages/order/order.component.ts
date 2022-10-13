import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  param = '';
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.initOrder();
  }

  initOrder() {
    if (this.param != '') {
      this.orderService.findById(this.param).subscribe((res) => {
        console.log(res);
      });
    }
  }
  getParams() {
    this.route.params
      .subscribe((params) => {
        this.param = params['id'];
      })
      .unsubscribe();
  }
}
