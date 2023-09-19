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
import {NgFor, AsyncPipe, CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';




export interface PeriodicElement {
  id_IR: string;
  area_manager: string;
  area: string,
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
  license_expiration: Date;
  notes: string ;
}

@Component({
  selector: 'app-registry-table',
  styleUrls: ['./registry-table.component.css'],
  templateUrl: './registry-table.component.html',
  standalone: true,
  imports:[
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, 
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    AsyncPipe,
    NgFor,
    MatCardModule,
    CommonModule
  ]
})

export class RegistryTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  licenseControl = new FormControl('');
  filterControl = new FormControl('');
  uniqueLicenses:any;
  options: string[] = [];
  
  
  
  filteredOptions!: Observable<string[]>;

  constructor(private http: HttpClient) {}

  displayedColumns: string[] = [
    'id_IR',
    //'employee_number',
    'employee_name',
    //'CC_number',
    'license',
    'license_status',
    'license_expiration',
    'notes',
    'CC_name',
    'sub_area_name',
    //'sub_area_abbreviation',
    'sub_area_manager',
    //'area',
    //'area_abbreviation',
    //'area_manager',
  ];

  dataSource = new MatTableDataSource<PeriodicElement>([]); // Inicializa el dataSource como una instancia de MatTableDataSource

  ngOnInit(): void {
    this.getRegistry();
    this.filteredOptions = this.licenseControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  
    // Suscríbete a los cambios en el filtro y aplícalo a la tabla
    this.filterControl.valueChanges.subscribe(filterValue => {
      this.dataSource.filter = filterValue!.trim().toLowerCase();
    });
    this.licenseControl.valueChanges.subscribe(filterValue => {
      this.dataSource.filter = filterValue!.trim().toLocaleLowerCase();
    });
    
  }
  


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getRegistry() {
    const url = 'http://10.23.104.56:8000/api/registry';
    
    this.http
      .get<PeriodicElement[]>(url)
      .pipe(
        tap((data) => {
          this.dataSource.data = data; // Asigna los datos al dataSource
          this.dataSource.paginator = this.paginator; // Configura el paginador
          this.dataSource.sort = this.sort;
          let license: string[] = data.map((element) => {
            return element.license;
          });
          license = [... new Set(license)]
          this.options = license.sort();
          console.log(this.options);
        }),
        catchError((error: any) => {
          console.error(error);
          return of([]); // En caso de error, asigna un arreglo vacío o maneja el error según tu necesidad.
        })
      )
      .subscribe();
  }
}