import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order.model';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  param = '';

  orderFormGroup!: FormGroup;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.initOrder();
  }

  initOrder() {
    if (this.param != '') {
      this.orderService
        .findById(this.param)
        .pipe(take(1))
        .subscribe((res) => {
          if (res.product.length > 0) {
            //  TO DO
            // Loop through products and get those from server
          }
          this.orderFormGroup = this.fb.group({
            _id: res._id,
            products: [res.product],
          });
        });
    }
  }
  getParams() {
    this.route.params.pipe(take(1)).subscribe((params) => {
      this.param = params['id'];
    });
  }
  onSubmit() {
    console.log(this.orderFormGroup.value);
  }
}
