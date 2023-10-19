import { Component,OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import * as XLSX from 'xlsx'; 
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {Observable} from 'rxjs';
import { environment as test } from 'src/enviroments/enviroment';

const urlTest = test.apiUrl;
@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css'],
  standalone: true,
  imports:[
    MatButtonModule
  ]
})
export class ExcelComponent implements OnInit {

registry: any[] = []

fechaActual: string = '';

  constructor(private http: HttpClient){}

  

  ngOnInit(): void {
    this.getRegistry();
    
  }

  converToExcel():void{
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.registry);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'licenses invetory total');
    
    
    XLSX.writeFile(wb, 'licenses_invetory_'+this.getDate()+'.xlsx');
  }

  getRegistry(){
    const url = urlTest+'/registry';
    const unknown_date = '2000-01-01 00:00:00.000'
    const lifetime_date = '9999-12-31 00:00:00.000'
    
    this.http.get<any[]>(url).pipe(
      tap((data) =>{
        this.registry = data;
        
         this.registry.forEach((element) => {
          element.license_expiration === unknown_date ? element.license_expiration = 'unknown' :null;
          element.license_expiration === lifetime_date ? element.license_expiration = 'lifeTime license' : null;  
         });
         
      }),
      catchError((error: any)=>{
        console.error(error)
        return of([]);
      })
    ).subscribe();
  }
  getDate(){
    const fecha = new Date();
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // ¡+1 porque los meses se indexan desde 0!
    const yyyy = fecha.getFullYear();
   return this.fechaActual = `${dd}-${mm}-${yyyy}`;
  }
}
