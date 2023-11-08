import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { HttpRequestService } from '../services/http/http-request.service';
import { CommonModule } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { LoaderComponent } from '../loader/loader.component';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-create-registry-dialog',
  templateUrl: './create-registry-dialog.component.html',
  styleUrls: ['./create-registry-dialog.component.css'],
  standalone:true,
  imports:[
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    LoaderComponent,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDatepickerModule
  ]
})
export class CreateRegistryDialogComponent implements OnInit {
registryValue:any;
isLoading:boolean = true;

userControl = new FormControl('');
users:any;
selectedUserName: string = '';
selectedUserEmail: string = '';
selectedUserNumber!: number;
filteredUsers:any;
newEmployeeToggle: boolean = false;

area:any;
areaControl = new FormControl(); // Debes inicializar el FormControl
areaSelectVal: any

//sub area variables
sub_area:any;
sub_area_filtered:any;
subAreaControl = new FormControl('',Validators.required);

// cost center variables
costCenter:any;
costCenterFiltered:any;
costCenterControl = new FormControl('',Validators.required);

//license variables

licenseControl = new FormControl('', Validators.required);
licenseStatus:string = '';
licenseExp:string = '';
licenseExpVal:Date = new Date('');
lifeTime: boolean = false;
unknownExp: boolean = false;
//note variables
note:any;
noteControl =  new FormControl('');


constructor(private http:HttpRequestService, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<CreateRegistryDialogComponent>){

}

  async ngOnInit(): Promise<void> {
  await this.getArea();
  await this.getSubArea();
  await this.getCostCenter();
  await this.getUsers();
  this.isLoading = false;
  this.areaControl.valueChanges.subscribe(selectAreaValue => {
    this.filterSubArea(selectAreaValue);
  });

  // Observador para cambios en el control de selección de subárea
  this.subAreaControl.valueChanges.subscribe(selectSubAreaValue => {
    if (selectSubAreaValue) {
      this.filterCostCenter(selectSubAreaValue);
    }
  });
  }

  onUserInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.filteredUsers = this.filterUsers(input);
  }
  
  // Función para filtrar frutas según la entrada del usuario
  filterUsers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user: { employee_name: string; }) => user.employee_name.toLowerCase().includes(filterValue));
  }
  userSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedUserName = event.option.value.employee_name;
    this.selectedUserEmail = event.option.value.email;
    this.selectedUserNumber = Number(event.option.value.employee_number);
    console.log('Selected User:', this.selectedUserName);
    // Puedes realizar acciones adicionales aquí
  }
  /**
 * Filtra las subáreas según el nombre del área seleccionado.
 * @param areaName - El nombre del área seleccionado.
 */
filterSubArea(areaName: string): void {
  // Filtra las subáreas que pertenecen al área seleccionada y las asigna a la propiedad sub_area_filtered.
  const filterSubArea = this.sub_area.filter((subArea: any) => subArea.belong_area === areaName);
  this.sub_area_filtered = filterSubArea;
}

/**
 * Filtra los centros de costo según el nombre de la subárea seleccionada.
 * @param sub_area_name - El nombre de la subárea seleccionada.
 */
filterCostCenter(sub_area_name: string): void {
  // Filtra los centros de costo que pertenecen a la subárea seleccionada y los asigna a la propiedad costCenterFiltered.
  const filterCC = this.costCenter.filter((costCenter: any) => costCenter.sub_area_name === sub_area_name);
  this.costCenterFiltered = filterCC;
}
  addNewEmployee(){
    this.newEmployeeToggle = true;
    this.selectedUserEmail = '';
    this.selectedUserNumber = NaN;
    this.selectedUserName = '';
  }

  generateRegistryOBJ() {
    const subAreaName = this.subAreaControl.value;
    const costCenter = this.costCenterControl.value;
    const employeeNumber = this.selectedUserNumber;
    const employeeName = this.selectedUserName;
    const email = this.selectedUserEmail;
    const license = this.licenseControl.value;
    const licenseStatus = this.licenseStatus == '' ? '' : this.licenseStatus;
    const licenseExpiration = this.licenseExp == '' ? '' : this.licenseExp;
    const notes = this.noteControl.value;
  
    if (
      !subAreaName ||
      !costCenter ||
      !employeeNumber ||
      !employeeName ||
      !license ||
      !licenseStatus ||
      !licenseExpiration
    ) {
      // Algunas de las variables son vacías, puedes manejarlo aquí
      
      return null; // Otra acción apropiada, como mostrar un mensaje de error
    }
  
    // Si todas las variables tienen valores, crea el objeto
    return {
      sub_area_name: subAreaName,
      CC_number: costCenter,
      employee_number: String(employeeNumber),
      employee_name: employeeName,
      email: email === undefined || email === '' ? null : email,
      license: license,
      license_status: licenseStatus,
      license_expiration: licenseExpiration,
      notes: notes,
    };
  }
  
  async createRegistry(): Promise<void>{
    if (this.generateRegistryOBJ() == null) {
      this.showSnackbar();
    }
    try{
      await this.httpPostRegistry();
    }
    finally{
      this.dialogRef.close();
    }
    console.log(this.generateRegistryOBJ());
    
    
  }
  httpPostRegistry():Promise<void>{
    return new Promise<void>((resolve,reject) => {
      this.http.createRegistry(this.generateRegistryOBJ()).subscribe({
        next: () => {
          resolve(); // Resuelve la promesa cuando la solicitud se completa con éxito.
        },
        error:error => {
          console.error('Error al generar el registro', error);
          reject(); // Rechaza la promesa en caso de error.
        }
      });
    });
  }
  showSnackbar() {
    this.snackBar.open('Algunos campos están vacíos', 'Cerrar', {
      duration: 3000, // Duración en milisegundos (3 segundos en este caso)
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
getUsers(){
  return new Promise<void>((resolve,reject) => {
    this.http.getUser().subscribe({
      next:(response:any) => {
        this.users = response.filter((element: { employee_name: string; }) => {
          return element.employee_name !== 'license admin';
        });

        this.users.sort((a: { employee_name: string; }, b: { employee_name: string; }) => {
          // Compara las propiedades 'employee_name' de los objetos a y b
          const nameA = a.employee_name.toLowerCase();
          const nameB = b.employee_name.toLowerCase();
        
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        resolve();
      },
      error:error => {
        console.error('error',error);
        reject();
      }
    });
  });
}
getArea(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.http.getAreas().subscribe({
      next: response => {
        this.area = response; // Almacena los datos de áreas en la propiedad "area".
        resolve(); // Resuelve la promesa cuando la solicitud es exitosa.
      },
      error: error => {
        console.error('Error al obtener las áreas', error);
        reject(); // Rechaza la promesa en caso de error.
      }
    });
  });
}

/**
 * Realiza una solicitud HTTP para obtener la lista de subáreas disponibles y filtra las subáreas
 * que pertenecen al área especificada.
 *
 * @returns Una promesa que se resuelve con los datos de las subáreas filtradas.
 */
getSubArea(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.http.getSubAreas().subscribe({
      next: response => {
        this.sub_area = response; // Almacena los datos de subáreas en la propiedad "sub_area".
        
        resolve(); // Resuelve la promesa cuando la solicitud es exitosa.
      },
      error: error => {
        console.error('Error al obtener las subáreas', error);
        reject(); // Rechaza la promesa en caso de error.
      }
    });
  });
}

/**
 * Realiza una solicitud HTTP para obtener la lista de centros de costo disponibles y filtra los centros
 * de costo que pertenecen a la subárea especificada.
 *
 * @returns Una promesa que se resuelve con los datos de los centros de costo filtrados.
 */
getCostCenter(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.http.getCostCenter().subscribe({
      next: response => {
        this.costCenter = response; // Almacena los datos de centros de costo en la propiedad "costCenter".
        resolve(); // Resuelve la promesa cuando la solicitud es exitosa.
      },
      error: error => {
        console.error('Error al obtener los centros de costo', error);
        reject(); // Rechaza la promesa en caso de error.
      }
    });
  });
}
//shared functions
/**
 * Maneja el evento de cambio de fecha del datepicker y actualiza el estado de la licencia.
 * @param event - El evento de cambio de fecha.
 */
onDateChange(event: any): void {
  // Formatea la fecha y determina si la licencia está activa o vencida.
  this.licenseExp = this.formatDate(event.value);
  this.licenseStatus = this.activeOrExpired(this.licenseExp);
}

/**
 * Restablece la fecha de vencimiento de la licencia a "9999-12-31" y establece el estado de la licencia en "active".
 */
lifeTimeFunc(): void {
  this.licenseExpVal = new Date(''); // Establece el valor del input en una cadena vacía
  this.unknownExp = false;
  this.licenseExp = '9999-12-31';
  this.licenseStatus = 'active';
}

/**
* Restablece la fecha de vencimiento de la licencia a "2000-01-01" y establece el estado de la licencia en "active".
*/
unknownExpFunc(): void {
  this.licenseExpVal = new Date(''); // Establece el valor del input en una cadena vacía
  this.lifeTime = false;
  this.licenseExp = '2000-01-01';
  this.licenseStatus = 'active';
}
/**
 * Formatea una fecha en el formato 'YYYY-MM-DD'.
 * @param inputDate - La fecha de entrada en formato de cadena.
 * @returns La fecha formateada en formato 'YYYY-MM-DD'.
 */
formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // El mes comienza en 0
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Determina si una fecha es activa o vencida en comparación con la fecha actual.
 * @param inputDate - La fecha en formato 'YYYY-MM-DD'.
 * @returns 'active' si la fecha es mayor que la fecha actual, 'expired' en caso contrario.
 */
activeOrExpired(inputDate: string): string {
  const formattedDate = this.formatDate(inputDate);
  const currentDate = this.formatDate(new Date().toString());
  return formattedDate > currentDate ? 'active' : 'expired';
}
}
