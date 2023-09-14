import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {NgFor, AsyncPipe} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

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
  notes: string ;
}

@Component({
  selector: 'app-registry-table',
  styleUrls: ['./registry-table.component.css'],
  templateUrl: './registry-table.component.html',
  standalone: true,
  imports:[
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, 
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    AsyncPipe,
    NgFor]
  

  
})

export class RegistryTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;

  constructor(private http: HttpClient) { }
  
  displayedColumns: string[] = [  
    'id_IR',
    'employee_number',  
    'employee_name',  
    'CC_number',  
    'CC_name',  
    'license',  
    'license_status',  
    'license_expiration',  
    'notes',
    'sub_area_name',
    'sub_area_abbreviation', 
    'sub_area_manager',   
    'area',
    'area_abbreviation',  
    'area_manager',
    
    
  ];
    
  dataSource = new MatTableDataSource<PeriodicElement>([]); // Inicializa el dataSource como una instancia de MatTableDataSource

  ngOnInit(): void {
    this.getRegistry();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  getRegistry() {
    const url = 'http://127.0.0.1:8000/api/registry';
    this.http.get<PeriodicElement[]>(url).pipe(
      tap((data) => {
        this.dataSource.data = data; // Asigna los datos al dataSource
        this.dataSource.paginator = this.paginator; // Configura el paginador
        this.dataSource.sort = this.sort;
      }),
      catchError((error: any) => {
        console.error(error);
        return of([]); // En caso de error, asigna un arreglo vacío o maneja el error según tu necesidad.
      })
    ).subscribe();
  }
}
