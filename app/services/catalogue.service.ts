import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  host:string = "https://localhost:5001/"

  private dataSource = new BehaviorSubject<any>('InitialState')
  newProductCreated = false
  productUpdated = false
  newCategoryCreated = false
  categoryUpdated = false
  newCustomerCreated = false
  customerUpdated = false
  private catDataSource = new BehaviorSubject<any>('InitialState')
  private custDataSource = new BehaviorSubject<any>('InitialState')

  constructor(private httpClient:HttpClient) { }

  public getRessource(url:string){
    return this.httpClient.get(this.host + url)
  }

  public saveRessource(url:string, data:any){
    return this.httpClient.post(this.host + url, data)
  }

  public updateRessource(url:string, data:any){
    return this.httpClient.put(this.host + url, data)
  }

  public deleteRessource(url:string){
    return this.httpClient.delete(this.host + url)
  }

  getData(){
    return this.dataSource.asObservable()
  }

  setData(data:any){
    this.dataSource.next(data)
  }

  getCatData(){
    return this.catDataSource.asObservable()
  }

  setCatData(data:any){
    this.catDataSource.next(data)
  }

  getCustData(){
    return this.custDataSource.asObservable()
  }

  setCustData(data:any){
    this.custDataSource.next(data)
  }

}