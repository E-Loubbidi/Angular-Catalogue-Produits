import { stringify } from '@angular/compiler/src/util';
import { Component, EventEmitter, OnInit, Output, AfterViewChecked, AfterViewInit, AfterContentInit, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products:any
  newProductCreated=false
  productUpdated=false
  productDeleted=false
  staticAlertClosed=false
  updatedStaticAlertClosed=false
  deletedStaticAlertClosed=false
  categories
  currentCategory:Category
  cheked = false
  search = false
  nameProd
  size:number = 8
  currentPage:number = 1
  totalPages:number
  pages:Array<number>

  constructor(private catalogService:CatalogueService, private router:Router) { }

  ngOnInit(): void {
    this.getProducts()
    this.getCategoriesList()
    this.currentCategory = new Category()
    this.currentCategory.categoryID = 0
    this.currentCategory.name = 'Tous'
    this.newProductCreated = this.catalogService.newProductCreated
    this.productUpdated = this.catalogService.productUpdated
    setTimeout(() => {this.staticAlertClosed = true; this.catalogService.newProductCreated = false;}, 20000)
    setTimeout(() => {this.updatedStaticAlertClosed = true; this.catalogService.productUpdated = false;}, 20000)
    setTimeout(() => {this.deletedStaticAlertClosed = true; this.productDeleted = false;}, 20000)
  }

  ngAfterViewChecked(){
    if(this.currentCategory && this.cheked) {
      if(this.currentCategory.name=='Tous') this.getProducts()
      else this.onGetProdsByCategory()
      this.cheked = false
    }
    if(this.search){
      this.onSearchProductsByName()
      this.search=false
    }
  }

  setCurrentCategory(){
    this.cheked = true
    this.currentPage = 1
    this.currentCategory = new Category()
    this.currentCategory.categoryID = 0
    this.currentCategory.name = 'Tous'
    console.log(this.currentCategory)
  }

  closeAlert(){
    this.staticAlertClosed = true
    this.newProductCreated =  false
  }

  closeAlertForUpdate(){
    this.updatedStaticAlertClosed = true
    this.productUpdated =  false
  }

  closeAlertForDelete(){
    this.deletedStaticAlertClosed = true
    this.productDeleted = false
  }

  getCategoriesList(){
    this.catalogService.getRessource("api/categories")
    .subscribe(data => {
      this.categories = data
    },err => {
      console.log(err)
    })
  }

  getAllProds(){
    this.catalogService.getRessource("api/products/")
    .subscribe(data => {
      console.log("-----------", new Number(data['length'] / this.size).toString().split('.')[0], '------------'); 
      var len = data['length'] / this.size
      if(len > new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf()) this.totalPages  = new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf() + 1
      else this.totalPages  = new Number(new Number(data['length'] / this.size).toString().split('.')[0]).valueOf()
      console.log('***********', this.totalPages) 
      this.pages = new Array<number>(this.totalPages)
    })
  }

  getProducts(){
    this.catalogService.getRessource("api/products/paginate?page="+this.currentPage+"&size="+this.size)
    .subscribe(data => {
      this.products = data
      this.getAllProds()
    },err => {
      console.log(err)
    })
  }

  onPageProduct(i){
    this.currentPage = i + 1
    if(this.currentCategory.name=='Tous') this.getProducts()
    else this.onGetProdsByCategory() 
    window.scroll(0,0)
  }

  nextPage(){
    this.currentPage = this.currentPage + 1
    if(this.currentCategory.name=='Tous') this.getProducts()
    else this.onGetProdsByCategory() 
    window.scroll(0,0)
  }

  previousPage(){
    this.currentPage = this.currentPage - 1
    if(this.currentCategory.name=='Tous') this.getProducts()
    else this.onGetProdsByCategory() 
    window.scroll(0,0)
  }

  onGetProductsByCategory(){
    console.log(this.currentCategory)
    this.catalogService.getRessource("api/products/byCat/"+this.currentCategory.categoryID)
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

  onGetProdsByCategory(){
    console.log(this.currentCategory)
    this.catalogService.getRessource("api/products/byCat/" + this.currentCategory.categoryID + "/paginate?page=" + this.currentPage + "+&size=" + this.size)
    .subscribe(data => {
      this.products = data
      this.onGetProductsByCategory()
    },err => {
      console.log(err)
    })
  }

  getCurrentCategory(c){
    this.cheked = true
    this.currentCategory = c
    this.currentPage = 1
  }

  onAddProduct(){
    this.router.navigateByUrl("nouveau-produit")
  }

  onUpdateProduct(prod){
    console.log(prod)
    this.catalogService.setData(prod)
    this.router.navigateByUrl("modif-produit")
  }

  onDeleteProduct(data:any){
    console.log(data)
    this.catalogService.deleteRessource("api/products/"+data.productId)
    .subscribe(res => {
      this.productDeleted=true
      this.currentPage = 1
      this.getProducts()
      window.scroll(0,0)
    },
    err=>console.log(err))
  }

  onSearchProdByName(){
    console.log(this.nameProd)
    this.catalogService.getRessource("api/products/byName/"+this.nameProd.name)
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

  onSearchProductsByName(){
    console.log(this.nameProd)
    if (!this.nameProd.name.match("^\\s*$")) {
      this.catalogService.getRessource("api/products/byName/" + this.nameProd.name + "/paginate?page=" + this.currentPage + "+&size=" + this.size)
    .subscribe(data => {
      console.log(data)
      this.products = data
      this.onSearchProdByName()
      console.log(this.products)
    },err => {
      console.log(err)
    })
    } else {
      if(this.cheked && this.currentCategory.name=='Tous') this.getProducts()
      else if(this.cheked) this.onGetProdsByCategory()
    }
  }

  onSearch(v){
    this.currentPage = 1
    this.search = true
    this.nameProd = v
    console.log(this.nameProd)
  }

}
