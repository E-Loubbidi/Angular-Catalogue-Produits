import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit, AfterViewChecked} from '@angular/core';
import { Router } from '@angular/router';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  currentPage:number = 1
  size:number = 8
  categories
  newCategoryCreated:boolean=false
  staticAlertClosed:boolean=false
  categoryUpdated:boolean=false
  updatedStaticAlertClosed:boolean=false
  categoryDeleted:boolean=false
  deletedStaticAlertClosed:boolean=false
  totalPages:number
  pages:Array<number>
  search = false
  nameCat
  empty:boolean=false

  constructor(private catalogService:CatalogueService, private router:Router) { }

  ngOnInit(): void {
    this.getAllCategories()
    this.newCategoryCreated = this.catalogService.newCategoryCreated
    this.categoryUpdated = this.catalogService.categoryUpdated
    setTimeout(() => {this.staticAlertClosed = true; this.catalogService.newCategoryCreated = false;}, 20000)
    setTimeout(() => {this.updatedStaticAlertClosed = true; this.catalogService.categoryUpdated = false;}, 20000)
    setTimeout(() => {this.deletedStaticAlertClosed = true; this.categoryDeleted = false;}, 20000)
  }

  ngAfterViewChecked(){
    if(this.search){
      this.onSearchCategoriesByName()
      this.search=false
    }
  }

  closeAlert(){
    this.staticAlertClosed = true
    this.newCategoryCreated =  false
  }

  closeAlertForUpdate(){
    this.updatedStaticAlertClosed = true
    this.categoryUpdated =  false
  }

  closeAlertForDelete(){
    this.deletedStaticAlertClosed = true
    this.categoryDeleted = false
  }

  getCategories(){
    this.catalogService.getRessource("api/categories")
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

  getAllCategories(){
    this.catalogService.getRessource("api/categories/paginate?page="+ this.currentPage + "&size=" + this.size)
    .subscribe(data => {
      this.categories = data
      if(this.categories['length']!=0) this.empty = false
      this.getCategories()
    }, err => console.log(err))
  }

  onDisplayCategories(){
    this.currentPage = 1
    this.getAllCategories()
  }

  onAddCategory(){
    this.router.navigateByUrl("nouvelle-categorie")
  }

  onUpdateCategory(cat){
    console.log(cat)
    this.catalogService.setCatData(cat)
    this.router.navigateByUrl("modif-categorie")
  }

  onDeleteCategory(cat){
    this.catalogService.deleteRessource("api/categories/"+cat.categoryID)
    .subscribe(res => {
      this.categoryDeleted=true
      this.currentPage=1
      this.getAllCategories()
      window.scroll(0,0)
    },
    err=>console.log(err))
  }

  onPageProduct(i){
    this.currentPage = i + 1
    this.getAllCategories()
    window.scroll(0,0)
  }

  previousPage(){
    this.currentPage = this.currentPage - 1
    this.getAllCategories() 
    window.scroll(0,0)
  }

  nextPage(){
    this.currentPage = this.currentPage + 1
    this.getAllCategories() 
    window.scroll(0,0)
  }

  onSearchCatByName(){
    console.log(this.nameCat)
    this.catalogService.getRessource("api/categories/byName/"+this.nameCat.name)
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

  onSearchCategoriesByName(){
    console.log(this.nameCat)
    if (!this.nameCat.name.match("^\\s*$")) {
      this.catalogService.getRessource("api/categories/byName/" + this.nameCat.name + "/paginate?page=" + this.currentPage + "+&size=" + this.size)
    .subscribe(data => {
      console.log(data)
      this.categories = data
      this.onSearchCatByName()
      console.log(this.categories)
      if(this.categories['length']==0) this.empty = true
    },err => {
      console.log(err)
    })
    } else this.getAllCategories()
  }

  onSearch(v){
    this.currentPage = 1
    this.search = true
    this.nameCat = v
    console.log(this.nameCat)
  }

}
