import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment as test } from 'src/enviroments/enviroment';


const urlTest = test.apiUrl;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  panelOpenState = false;
  
  title = 'licenses_inventory';



  usuarios: any;
  registryCounts:any;

constructor( private http: HttpClient ){

}
  ngOnInit(): void {
   

    
    this.getRegistryCounts();
  }


  
  
  
    getRegistryCounts(){
      
      const url = urlTest+'/total-Licenses';
      this.http.get<any>(url).pipe(
        tap((data)=> {
          this.registryCounts = data;
          
        }),
        catchError((error:any)=>{
          console.error(error);
          return of(null);
        })
      ).subscribe();
        
    }
    
    
}
