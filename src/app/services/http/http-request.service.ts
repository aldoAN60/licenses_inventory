import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
private baseUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) { }

  getAuthUser(username:string, password:string){
    const url = this.baseUrl+'/authUser?username='+username+'&password='+password;

    return this.http.get(url);
  }
  getAreas(){
    const url = this.baseUrl+'getArea';
    return this.http.get(url);
  }
}
