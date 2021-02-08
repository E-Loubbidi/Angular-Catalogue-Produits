import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../models/category';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {

  updateCategoryForm : FormGroup
  submitted:boolean = false
  currentCategory:any
  categories:any
  newCharacForm : FormGroup
  charArray
  category:Category
  categoryToUpdate:Category
  catDataForSibling:any
  subscription:Subscription

  constructor(private formBuilder:FormBuilder, private catalogService:CatalogueService, private router:Router) { }

  ngOnInit(): void {
    this.updateCategoryForm = this.formBuilder.group({
      name:['', Validators.required]
    })
    this.subscription = this.catalogService.getCatData().subscribe(data => this.catDataForSibling = data)
  }

  onUpdateCategory(data){
    this.submitted = true
    // stop here if form is invalid
    if (this.updateCategoryForm.invalid) {
      console.log('Invalid!!!', this.updateCategoryForm);
          return;
      }
      this.catalogService.categoryUpdated = this.submitted
      this.category = new Category();
      this.category.categoryID = this.catDataForSibling.categoryID
      this.category.name =  data.name
      this.catalogService.updateRessource("api/categories/"+this.catDataForSibling.categoryID, this.category)
      .subscribe(res => {
        this.currentCategory = res
        this.router.navigateByUrl("categories");
    },err => {
      console.log(err)
    })
  }

  onReset(){
    this.submitted = false
    this.updateCategoryForm.reset()
  }

  get form() { return this.updateCategoryForm.controls; }

}
