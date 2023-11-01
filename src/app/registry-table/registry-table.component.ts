import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { ExcelComponent } from '../excel/excel.component';
import { environment as test } from 'src/enviroments/enviroment';
import { MatIconModule } from '@angular/material/icon';
import {SelectionModel} from '@angular/cdk/collections';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { SharedVariablesService } from '../services/sharedVriables/shared-variables.service';
import { HttpRequestService } from '../services/http/http-request.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

const urlTest = test.apiUrl;

export interface LicenseRegistry {
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
    CommonModule,
    ExcelComponent,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule

  ]
})

export class RegistryTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  TotalRegistryCounts:any;
  licenseControl = new FormControl('');
  filterControl = new FormControl('');
  uniqueLicenses:any;
  licenseSelect: string[] = [];



  filteredLicenses!: Observable<string[]>;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog, 
    private sharedVariables: SharedVariablesService,
    private htp:HttpRequestService,
    private snackBar: MatSnackBar
    ) {}


  displayedColumns: string[] = [
    'select',
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
    'actions'
  ];

  dataSource = new MatTableDataSource<LicenseRegistry>([]); // Inicializa el dataSource como una instancia de MatTableDataSource
  selection = new SelectionModel<LicenseRegistry>(true, []);

/**
 * Inicializa el componente y realiza varias acciones al cargar.
 */
ngOnInit(): void {
  // Obtener la cantidad de registros
  this.getRegistryCounts();

  // Obtener los registros
  this.getRegistrys();

  // Filtrar las licencias en tiempo real
  this.filteredLicenses = this.licenseControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value || '')),
  );

  // Suscribirse a los cambios en el filtro y aplicarlo a la tabla
  this.filterControl.valueChanges.subscribe(filterValue => {
    this.dataSource.filter = filterValue!.trim().toLowerCase();
  });

  // Suscribirse a los cambios en la selección de licencias y aplicarlo a la tabla
  this.licenseControl.valueChanges.subscribe(filterValue => {
    this.dataSource.filter = filterValue!.trim().toLocaleLowerCase();
  });
}


/**
 * Filtra un arreglo de opciones de licencias según el valor de búsqueda proporcionado.
 * 
 * @param value - El valor de búsqueda para filtrar las opciones.
 * @returns Un arreglo de opciones de licencias que coinciden con el valor de búsqueda.
 */
private _filter(value: string): string[] {
  // Convierte el valor de búsqueda a minúsculas para hacer la búsqueda sin distinción de mayúsculas.
  const filterValue = value.toLowerCase();

  // Filtra las opciones de licencias que incluyen el valor de búsqueda en minúsculas.
  return this.licenseSelect.filter(option => option.toLowerCase().includes(filterValue));
}


/**
 * Verifica si todos los elementos de la tabla están seleccionados.
 * 
 * @returns `true` si todos los elementos están seleccionados; de lo contrario, `false`.
 */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

/**
 * Alternar la selección de todos los elementos.
 */
masterToggle() {
  this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
}

/**
 * Alternar la selección de un elemento de la tabla.
 * 
 * @param row - El elemento de la tabla que se va a alternar.
 */
toggle(row: LicenseRegistry) {
  this.selection.toggle(row);
}

/**
 * Muestra en la consola los elementos seleccionados.
 */
showSelected() {
  const selectedData = this.selection.selected;
  console.log('Elementos seleccionados:', selectedData);
}


/**
 * Abre un cuadro de diálogo para actualizar un registro.
 * @remarks
 * Si el resultado del cuadro de diálogo no es una cadena vacía, se llama a la función getRegistrys
 * para actualizar la lista de registros y se muestra un mensaje Snackbar con el mensaje "Registro actualizado".
 */
openDialog() {
  const dialogRef = this.dialog.open(DialogComponent);

  dialogRef.afterClosed().subscribe(async result => {
    if (result !== '') {
      await this.getRegistrys();
      this.showSnackbar();
    }
  });
}

/**
 * Actualiza la variable compartida `updateRegistry` con el registro que se va a actualizar y luego abre el cuadro de diálogo.
 * @param updateRegistry - El registro que se va a actualizar.
 */
updateElement(updateRegistry: LicenseRegistry) {
  this.sharedVariables.updateRegistry = updateRegistry;
  this.openDialog();
}

/**
 * Muestra un mensaje Snackbar con el mensaje "Registro actualizado".
 */
showSnackbar() {
  this.snackBar.open('Registro actualizado', 'Cerrar', {
    duration: 3000, // Duración en milisegundos (3 segundos en este caso)
    horizontalPosition: 'right',
    verticalPosition: 'top',
  });
}


deleteElement(deleteRegistry: LicenseRegistry) {
  // Lógica para eliminar el elemento (por ejemplo, mostrar un diálogo de confirmación).
  console.log('Eliminar elemento:', deleteRegistry);
}

/**
 * Obtiene el número total de registros de licencias y actualiza la propiedad TotalRegistryCounts.
 */
getRegistryCounts() {
  const url = urlTest + '/total-Licenses';
  this.http.get<any>(url).pipe(
    tap((data) => {
      this.TotalRegistryCounts = data;
    }),
    catchError((error: any) => {
      console.error(error);
      return of(null);
    })
  ).subscribe();
}




/**
 * Obtiene los registros y los asigna al dataSource de la tabla.
 * 
 * @returns Una promesa que se resuelve cuando se obtienen los registros con éxito.
 * @throws Un error si hay algún problema al obtener los registros.
 */
getRegistrys() {
  return new Promise<void>((resolve, reject) => {
    this.htp.getRegistry().subscribe({
      next: (response: any) => {
        this.dataSource.data = response; // Asigna los datos al dataSource
        this.dataSource.paginator = this.paginator; // Configura el paginador
        this.dataSource.sort = this.sort;

        // Obtén la lista de licencias únicas del conjunto de registros
        let license: string[] = response.map((element: { license: any }) => {
          return element.license;
        });
        license = [...new Set(license)];
        this.licenseSelect = license.sort();

        resolve();
      },
      error: (error: any) => {
        console.error(error);
        reject(error);
      }
    });
  });
}

}