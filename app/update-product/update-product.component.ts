import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewChildren, QueryList, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../models/product';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  newProductForm : FormGroup
  submitted : boolean = false
  currentProduct:any
  categories:any
  newCharacForm : FormGroup
  charArray
  product:Product
  productToUpdate:Product
  dataForSibling:any
  subscription:Subscription
  selectedValue 
  characProd

  constructor(private formBuilder:FormBuilder, private catalogService:CatalogueService, private router:Router, private elRef:ElementRef, private readonly changeDetectorRef: ChangeDetectorRef) { }

  //@ContentChild('characInput', { static: true }) characInput !: ElementRef


  ngOnInit(): void {
    this.newProductForm = this.formBuilder.group({
      name:['', Validators.required],
      price:['', Validators.required],
      category:['', Validators.required],
      characteristics:this.formBuilder.array([]) 
    })
    this.getCategoriesList()
    this.subscription = this.catalogService.getData().subscribe(data => this.dataForSibling = data)
    console.log('********************************',this.dataForSibling)
    //console.log('ngOnInit', this.characInput)
   this.getCharacValues()
   console.log('mmmmmmmmmmm', this.dataForSibling.category.name)
   console.log('********this.characArray***********', this.characArray())
  }

  @ViewChildren('characInput') characInput : QueryList<any>
  @ViewChildren('selectedCategory') selectedCategory : QueryList<any>

  ngAfterViewChecked(){
    this.changeDetectorRef.detectChanges()
    for (let i = 0; i < this.dataForSibling.characteristics.length; i++) {
      console.log(this.dataForSibling.characteristics[i])
      //this.updateProdform.forEach(item => {console.log('item ', i, item); item.nativeElement.value=this.dataForSibling.characteristics[i]})
      if(this.dataForSibling.characteristics[i])
        this.characInput.toArray()[i].nativeElement.value = this.dataForSibling.characteristics[i]
      //console.log('heeeeeeeeeeeeeeeeeeeeeeey', this.selectedCategory)
      //this.selectedCategory.changes.subscribe(c => { console.log('hhhhhhhhhhh', c.toArray())})
    }
    console.log('characteristics......=>',this.characInput)
      this.selectedCategory.changes.subscribe(c => { 
        console.log('hhhhhhhhhhh', c.toArray()[0].nativeElement.options)
        for (let i = 0; i < c.toArray()[0].nativeElement.options.length; i++){
          if (c.toArray()[0].nativeElement.options[i].innerText==this.dataForSibling.category.name) {
            console.log('cccccccccccccccccccccccccccccccccc',c)
            console.log(c.toArray()[0].nativeElement.options[i])
            console.log(c.toArray()[0].nativeElement.options[i].innerText)
            console.log(this.dataForSibling.category.name)
            console.log('44444', this.form.category.errors)
            c.toArray()[0].nativeElement.options[i].selected = true
          }
        }  
      })
    }

  ngOnDestroy(): void{
    this.subscription.unsubscribe()
  }

  onReset(){
    this.submitted = false
    this.newProductForm.reset()
  }

  getCharateristics(){
    this.charArray = []
    for (let i = 0; i < this.dataForSibling.characteristics.length; i++) {
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeehhhhhhh', this.newProductForm.get("characteristics").value[i].characteristic)
      console.log('7777777777777', this.dataForSibling.characteristics)
      this.charArray.push(this.newProductForm.get("characteristics").value[i].characteristic);
    }
  }

  onUpdateProduct(data:any){
    this.submitted = true
    // stop here if form is invalid
    if (this.newProductForm.invalid) {
      console.log('Invalid!!!', this.newProductForm);
          return;
      }
      this.catalogService.productUpdated = this.submitted
      this.product = new Product();
      this.product.Name =  data.name
      this.product.Price = data.price
      this.product.CategoryID = this.dataForSibling.category.categoryID
      this.getCharateristics()
      this.product.Characteristics = this.charArray
      console.log('puuuuuuuuuuuuuuuuuuuuuuuut', data, this.product)
    this.catalogService.updateRessource("api/products/"+this.dataForSibling.productId, this.product)
    .subscribe(res => {
      this.currentProduct = res
      this.router.navigateByUrl("");
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
      characteristic:['' , Validators.required]
    })
  }

  addCharac(){
    this.newCharac()
    this.characArray().push(this.newCharacForm);
  }

  removeCharac(i:number) {
    console.log('i = ', i, this.characArray())
    console.log('looooooooooooooooooooooooooooooooooool', this.dataForSibling.characteristics)
    this.dataForSibling.characteristics.splice(i, 1)
    this.characArray().removeAt(i);
  }

  characArray() : FormArray {
    return this.newProductForm.get("characteristics") as FormArray
  }

  get formCharac() { return this.newCharacForm.controls; }

  getCharacToUpdate(){
    for (let i = 0; i < this.dataForSibling.characteristics.length; i++) {
      console.log(this.dataForSibling.characteristics[i])
      this.addCharac()
      //this.newCharacForm.patchValue({'characteristic' : this.dataForSibling.characteristics[i]})
      //this.newCharacForm.controls.characteristic.setValue(this.dataForSibling.characteristics[i])
      //this.newCharacForm.value.characteristic = this.dataForSibling.characteristics[i]
      console.log('this.newCharacForm=',this.newCharacForm)
    }
  }

  getCharacValues(){
    for (let i = 0; i < this.dataForSibling.characteristics.length; i++) {
      console.log(this.dataForSibling.characteristics[i])
      this.addCharac()
    }
  }

}