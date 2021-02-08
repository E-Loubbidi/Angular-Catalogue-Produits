import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../models/category';
import { CatalogueService } from '../services/catalogue.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  newCategoryForm:FormGroup
  submitted:boolean = false
  currentCategory:any
  category:Category

  constructor(private formBuilder:FormBuilder, private catalogService:CatalogueService, private router:Router) { }

  ngOnInit(): void {
    this.newCategoryForm = this.formBuilder.group({
      name:['', Validators.required]
    })
  }

  onAddNewCategory(data){
    this.submitted = true
    // stop here if form is invalid
    if(this.newCategoryForm.invalid) {
      console.log(this.newCategoryForm);
          return;
      }
      this.catalogService.newCategoryCreated = this.submitted
      this.category = new Category();
      console.log(data)
      this.category.name =  data.name
      this.category.categoryID = data.categoryID
      this.catalogService.saveRessource("api/categories", this.category)
      .subscribe(res => {
        this.currentCategory = res
        this.router.navigateByUrl("categories")
      },err => {
        console.log(err)
      })
  }

  onReset(){
    this.submitted = false
    this.newCategoryForm.reset()
  }

  get form() { return this.newCategoryForm.controls; }

}
