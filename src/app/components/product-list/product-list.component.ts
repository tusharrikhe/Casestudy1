import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
import { ProductService } from "src/app/services/product.service";
import { Product } from "src/app/model/products";
import { Router, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
  animations: [
    trigger("myInsertRemoveTrigger", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("5s", style({ opacity: 1 }))
      ]),
      transition(":leave", [animate("5s", style({ opacity: 0 }))])
    ])
  ]
})
export class ProductListComponent implements OnInit {
  config: any;

  collection = [];
  products: Product[];
  constructor(
    private route: ActivatedRoute,
    private productservice: ProductService,
    private router: Router
  ) {
    this.config = {
      currentPage: 1,

      itemsPerPage: 5
    };

    this.route.queryParamMap

      .map(params => params.get("page"))

      .subscribe(page => (this.config.currentPage = page));

    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  pageChange(newPage: number) {
    this.router.navigate(["product-list"], { queryParams: { page: newPage } });
  }

  ngOnInit() {
    if (localStorage.getItem("username") != null) {
      this.productservice.getProducts().subscribe(data => {
        this.products = data;
      });
    } else {
      this.router.navigate(["/login"]);
    }
  }
  getProducts() {
    if (localStorage.getItem("username") != null) {
      this.productservice.getProducts().subscribe(data => {
        this.products = data;
      });
    } else {
      this.router.navigate(["/login"]);
    }
  }

  deleteproduct(product: Product): void {
    let result = confirm("do you really want to delete the product?");
    if (result) {
      this.productservice.deleteproduct(product.id).subscribe(data => {
        this.products = this.products.filter(p => p !== product);
      });
    }
  }
  addproduct(): void {
    this.router.navigate(["add"]);
  }

  editproduct(product: Product): void {
    localStorage.removeItem("editProductId");
    localStorage.setItem("editProductId", product.id.toString());
    this.router.navigate(["edit"]);
  }
  deleteAllProduct() {
    if (confirm("Are you sure you want to delete all the products")) {
      for (let i = 0; i < this.products.length; i++) {
        this.productservice.deleteproduct(this.products[i].id).subscribe(() => {
          this.getProducts();
        });
      }
    }
  }
  backProduct() {
    this.router.navigate(["home"]);
  }
}
