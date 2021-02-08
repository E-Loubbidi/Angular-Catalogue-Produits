import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../models/customer';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  newCustomerForm:FormGroup
  submitted:boolean = false
  currentCustomer:any
  customer:Customer

  constructor(private formBuilder:FormBuilder, private catalogService:CatalogueService, private router:Router) { }

  ngOnInit(): void {
    this.newCustomerForm = this.formBuilder.group({
      name:['', Validators.required],
      email:['', Validators.required],
      phone:['', Validators.required]
    })
  }

  onAddNewCustomer(data){
    this.submitted = true
    // stop here if form is invalid
    if(this.newCustomerForm.invalid) {
      console.log(this.newCustomerForm);
          return;
      }
      this.catalogService.newCustomerCreated = this.submitted
      this.customer = new Customer();
      console.log(data)
      this.customer.name =  data.name
      this.customer.email =  data.email
      this.customer.phone =  data.phone
      this.customer.customerID = data.categoryID
      this.catalogService.saveRessource("api/customers", this.customer)
      .subscribe(res => {
        this.currentCustomer = res
        this.router.navigateByUrl("clients")
      },err => {
        console.log(err)
      })
  }

  onReset(){
    this.submitted = false
    this.newCustomerForm.reset()
  }

  get form() { return this.newCustomerForm.controls; }

}
