import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CustomersComponent } from './customers/customers.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { NewProductComponent } from './new-product/new-product.component';
import { ProductsComponent } from './products/products.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { UpdateCustomerComponent } from './update-customer/update-customer.component';
import { UpdateProductComponent } from './update-product/update-product.component';


const routes: Routes = [
  {path : "produits", component : ProductsComponent},
  {path : "nouveau-produit", component : NewProductComponent},
  {path : "modif-produit", component : UpdateProductComponent},
  {path : "categories", component : CategoriesComponent},
  {path : "nouvelle-categorie", component : NewCategoryComponent},
  {path : "modif-categorie", component : UpdateCategoryComponent},
  {path : "clients", component : CustomersComponent},
  {path : "nouveau-client", component : NewCustomerComponent},
  {path : "modif-client", component : UpdateCustomerComponent},
  {path : "", redirectTo : "/produits", pathMatch : "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
