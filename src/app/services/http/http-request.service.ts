import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as test } from 'src/enviroments/enviroment';
@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
private baseUrl = test.apiUrl;

  constructor(private http: HttpClient) { }

  getAuthUser(username:string, password:string){
    const url = this.baseUrl+'/authUser?username='+username+'&password='+password;

    return this.http.get(url);
  }
  getRegistry(){
    const url = this.baseUrl+'/registry';
    return this.http.get<[]>(url);
  }
  getAreas(){
    const url = this.baseUrl+'/getArea';
    return this.http.get(url);
  }
  getSubAreas(){
    const url = this.baseUrl+'/getSubArea'
    return this.http.get(url);
  }
  getCostCenter(){
    const url = this.baseUrl+'/getCostCenter'
    return this.http.get(url);
  }
  getUser(){
    const url = this.baseUrl+'/usuarios';
    return this.http.get(url);
  }
  updateRegistry(body:any){
    const url = this.baseUrl+'/updateRegistry';
    return this.http.patch(url,body);
  }
  createRegistry(body:any){
    const url = this.baseUrl+'/postRegistry';
    return this.http.post(url,body);
  }
  deleteRegistry(id_IR:any){
    const url = this.baseUrl+'/deleteRegistry/'+id_IR;
    return this.http.delete(url);
  }
}
