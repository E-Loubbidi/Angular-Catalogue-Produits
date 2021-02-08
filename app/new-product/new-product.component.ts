import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  newProductForm:FormGroup
  submitted:boolean = false
  currentProduct:any
  categories:any
  newCharacForm : FormGroup
  charArray
  product:Product
  pos:number

  constructor(private formBuilder:FormBuilder, private catalogService:CatalogueService, private router:Router) { }

  ngOnInit(): void {
    this.newProductForm = this.formBuilder.group({
      name:['', Validators.required],
      price:['', Validators.required],
      category:['', Validators.required],
      characteristics:this.formBuilder.array([]) 
    })
    this.getCategoriesList()
  }

  onReset(){
    this.submitted = false
    this.newProductForm.reset()
  }

  getCharateristics(){
    this.charArray = []
    for (let i = 0; i < this.characArray().length; i++) {
      this.charArray.push(this.newProductForm.get("characteristics").value[i].characteristic);
    }
  }

  onAddNewProduct(data:any){
    this.submitted = true
    // stop here if form is invalid
    if (this.newProductForm.invalid) {
      console.log(this.newProductForm);
          return;
      }
      this.catalogService.newProductCreated = this.submitted
      this.product = new Product();
      this.product.Name =  data.name
      this.product.Price = data.price
      this.product.CategoryID = data.category.categoryID
      this.getCharateristics()
      this.product.Characteristics = this.charArray
    this.catalogService.saveRessource("api/products", this.product)
    .subscribe(res => {
      this.currentProduct = res
      this.router.navigateByUrl("produits")
    },err => {
      console.log(err)
    })
  }

  get form() { return this.newProductForm.controls; }

  getCategoriesList(){
    this.catalogService.getRessource("api/categories")
    .subscribe(data => {
      this.categories = data
    },err => {
      console.log(err)
    })
  }

  newCharac() {
    this.newCharacForm = this.formBuilder.group({
      characteristic:['', Validators.required]
    })
  }

  addCharac(){
    window.scrollTo(0, document.documentElement.scrollHeight);
    this.newCharac()
    this.characArray().push(this.newCharacForm);
  }

  removeCharac(i:number) {
    this.characArray().removeAt(i);
  }

  characArray() : FormArray {
    return this.newProductForm.get("characteristics") as FormArray
  }

  get formCharac() { return this.newCharacForm.controls; }
}