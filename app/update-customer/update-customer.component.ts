import { Component, OnInit, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from '../models/customer';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent implements OnInit {

  updateCustomerForm : FormGroup
  submitted : boolean = false
  currentCustomer:any
  customer:Customer
  custDataForSibling:any
  subscription:Subscription

  constructor(private formBuilder:FormBuilder, private catalogService:CatalogueService, private router:Router) { }

  ngOnInit(): void {
    this.updateCustomerForm = this.formBuilder.group({
      name:['', Validators.required],
      email:['', Validators.required],
      phone:['', Validators.required]
    })
    this.subscription = this.catalogService.getCustData().subscribe(data => this.custDataForSibling = data)
    console.log('********************************',this.custDataForSibling)
  }

  ngOnDestroy(): void{
    this.subscription.unsubscribe()
  }

  onReset(){
    this.submitted = false
    this.updateCustomerForm.reset()
  }

  onUpdateCustomer(data:any){
    this.submitted = true
    // stop here if form is invalid
    if (this.updateCustomerForm.invalid) {
      console.log('Invalid!!!', this.updateCustomerForm);
          return;
      }
      this.catalogService.customerUpdated = this.submitted
      this.customer = new Customer();
      this.customer.customerID = this.custDataForSibling.customerID
      this.customer.name =  data.name
      this.customer.email = data.email
      this.customer.phone = data.phone
      console.log("custDataForSibling", this.custDataForSibling)
      this.catalogService.updateRessource("api/customers/"+this.custDataForSibling.customerID, this.customer)
      .subscribe(res => {
        this.currentCustomer = res
        this.router.navigateByUrl("clients");
    },err => {
      console.log(err)
    })
  }

  get form() { return this.updateCustomerForm.controls; }
}
