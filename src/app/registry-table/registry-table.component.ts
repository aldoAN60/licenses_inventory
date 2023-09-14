import { Component, OnInit } from '@angular/core';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface PeriodicElement {
  id_IR: string;
  area_manager: string;
  area_abbreviation: string;
  sub_area_manager: string;
  sub_area_abbreviation: string;
  sub_area_name: string;
  employee_number: string;
  employee_name: string;
  CC_number: string;
  CC_name: string;
  license: string;
  license_status: string;
  license_expiration: string;
  notes: string | null;
}


@Component({
  selector: 'app-registry-table',
  styleUrls: ['./registry-table.component.css'],
  templateUrl: './registry-table.component.html',
  standalone: true,
  imports:[MatTableModule]
  

  
})

export class RegistryTableComponent implements OnInit{

  constructor( private http: HttpClient ){}
  displayedColumns: string[] = [  
    'id_IR',
    'area_manager',
    'area_abbreviation',  
    'sub_area_manager',  
    'sub_area_abbreviation',  
    'sub_area_name',  
    'employee_number',  
    'employee_name',  
    'CC_number',  
    'CC_name',  
    'license',  
    'license_status',  
    'license_expiration',  
    'notes'
    ];
    
  dataSource: PeriodicElement[] = []; // Inicializa el dataSource como un arreglo vacío

  ngOnInit(): void {
    this.getRegistry();
  }
  

    getRegistry() {
      const url = 'http://127.0.0.1:8000/api/registry';
      this.http.get<PeriodicElement[]>(url).pipe(
        tap((data) => {
          this.dataSource = data; // Asigna los datos al dataSource
          console.log(this.dataSource);
        }),
        catchError((error: any) => {
          console.error(error);
          return of([]); // En caso de error, asigna un arreglo vacío o maneja el error según tu necesidad.
        })
      ).subscribe();
    }
    

}
