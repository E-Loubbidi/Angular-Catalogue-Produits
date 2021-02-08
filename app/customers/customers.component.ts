import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  currentPage:number = 1
  size:number = 8
  customers
  newCustomerCreated:boolean=false
  staticAlertClosed:boolean=false
  customerUpdated:boolean=false
  updatedStaticAlertClosed:boolean=false
  customerDeleted:boolean=false
  deletedStaticAlertClosed:boolean=false
  totalPages:number
  pages:Array<number>
  search = false
  nameCust
  empty:boolean=false

  constructor(private catalogService:CatalogueService, private router:Router) { }

  ngOnInit(): void {
    this.getAllCustomers()
    this.newCustomerCreated = this.catalogService.newCustomerCreated
    this.customerUpdated = this.catalogService.customerUpdated
    setTimeout(() => {this.staticAlertClosed = true; this.catalogService.newCustomerCreated = false;}, 20000)
    setTimeout(() => {this.updatedStaticAlertClosed = true; this.catalogService.customerUpdated = false;}, 20000)
    setTimeout(() => {this.deletedStaticAlertClosed = true; this.customerDeleted = false;}, 20000)
  }

  ngAfterViewChecked(){
    if(this.search){
      this.onSearchCustomersByName()
      this.search=false
    }
  }

  closeAlert(){
    this.staticAlertClosed = true
    this.newCustomerCreated =  false
  }

  closeAlertForUpdate(){
    this.updatedStaticAlertClosed = true
    this.customerUpdated =  false
  }

  closeAlertForDelete(){
    this.deletedStaticAlertClosed = true
    this.customerDeleted = false
  }

  getCustomers(){
    this.catalogService.getRessource("api/customers")
    .subscribe(data => {
      console.log(data)
      console.log("-----------", new Number(data['length'] / this.size).toString().split('.')[0], '------------'); 
      var len = data['length'] / this.size
      if(len > new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf()) this.totalPages  = new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf() + 1
      else this.totalPages  = new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf()
      console.log('***********', this.totalPages) 
      this.pages = new Array<number>(this.totalPages)
    }, err => console.log(err))
  }

  getAllCustomers(){
    this.catalogService.getRessource("api/customers/paginate?page="+ this.currentPage + "&size=" + this.size)
    .subscribe(data => {
      this.customers = data
      if(this.customers['length']!=0) this.empty = false
      this.getCustomers()
    }, err => console.log(err))
  }

  onDisplayCustomers(){
    this.currentPage = 1
    this.getAllCustomers()
  }

  onAddCustomer(){
    this.router.navigateByUrl("nouveau-client")
  }

  onUpdateCustomer(cust){
    console.log(cust)
    this.catalogService.setCustData(cust)
    this.router.navigateByUrl("modif-client")
  }

  onDeleteCustomer(cust){
    this.catalogService.deleteRessource("api/customers/"+cust.customerID)
    .subscribe(res => {
      this.customerDeleted=true
      this.currentPage=1
      this.getAllCustomers()
      window.scroll(0,0)
    },
    err=>console.log(err))
  }

  onPageProduct(i){
    this.currentPage = i + 1
    this.getAllCustomers()
    window.scroll(0,0)
  }

  previousPage(){
    this.currentPage = this.currentPage - 1
    this.getAllCustomers() 
    window.scroll(0,0)
  }

  nextPage(){
    this.currentPage = this.currentPage + 1
    this.getAllCustomers() 
    window.scroll(0,0)
  }

  onSearchCustByName(){
    console.log(this.nameCust)
    this.catalogService.getRessource("api/customers/byName/"+this.nameCust.name)
    .subscribe(data => {
      console.log("-----------", new Number(data['length'] / this.size).toString().split('.')[0], '------------'); 
      var len = data['length'] / this.size
      if(len > new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf()) this.totalPages  = new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf() + 1
      else this.totalPages  = new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf()
      console.log('***********', this.totalPages) 
      this.pages = new Array<number>(this.totalPages)
    },err => {
      console.log(err)
    })
  }

  onSearchCustomersByName(){
    console.log(this.nameCust)
    if (!this.nameCust.name.match("^\\s*$")) {
      this.catalogService.getRessource("api/customers/byName/" + this.nameCust.name + "/paginate?page=" + this.currentPage + "+&size=" + this.size)
    .subscribe(data => {
      console.log(data)
      this.customers = data
      this.onSearchCustByName()
      console.log(this.customers)
      if(this.customers['length']==0) this.empty = true
    },err => {
      console.log(err)
    })
    } else this.getAllCustomers()
  }

  onSearch(v){
    this.currentPage = 1
    this.search = true
    this.nameCust = v
    console.log(this.nameCust)
  }

}
