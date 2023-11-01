import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { HttpRequestService } from '../services/http/http-request.service';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import { SharedVariablesService } from '../services/sharedVriables/shared-variables.service';
import { MatSlideToggleModule, _MatSlideToggleRequiredValidatorModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports:[
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatGridListModule,
    MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule,
    FormsModule,
    LoaderComponent
  ]
})
export class DialogComponent implements OnInit{
registryValue:any;
isLoading:boolean = true;
  //area variables
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

//employee variables
employee:any;
employeeNumber:string = '';
employeeName: string ='';
employeeEmail: string ='';
employeeNumberControl = new FormControl('',Validators.required);
employeeNameControl = new FormControl('',Validators.required);
employeeEmailControl = new FormControl('');
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






  constructor(private http: HttpRequestService, private sharedVariables: SharedVariablesService, public dialogRef: MatDialogRef<DialogComponent>){}

/**
 * Método de ciclo de vida Angular que se ejecuta al inicializar el componente.
 * @remarks
 * - Asigna el valor del registro a `registryValue` obtenido de la variable compartida `updateRegistry`.
 * - Llama a las funciones `setInputValues`, `getArea`, `getSubArea`, y `getCostCenter` para obtener datos necesarios.
 * - Llama a la función `getUsers` para obtener la lista de usuarios.
 * - Habilita la propiedad `isLoading` después de realizar las solicitudes.
 * - Registra observadores en los cambios de los controles `areaControl` y `subAreaControl` para filtrar subáreas y centros de costo.
 */
async ngOnInit(): Promise<void> {
  this.registryValue = this.sharedVariables.updateRegistry;
  
  this.setInputValues();
  await this.getArea();
  await this.getSubArea();
  await this.getCostCenter();
  await this.getUsers();
  this.isLoading = false;

  // Observador para cambios en el control de selección de área
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
 * Genera un objeto que representa un registro de licencia con los datos actuales de los controles del formulario.
 *
 * @returns Un objeto que contiene los datos del registro de licencia.
 */
  generateRegistryOBJ(){
    
    return {
    'id_IR':this.registryValue.id_IR,
    'sub_area_name': this.subAreaControl.value,
    'CC_number': this.costCenterControl.value,
    'employee_number': this.employeeNumberControl.value,
    'employee_name': this.employeeNameControl.value,
    'email': this.employeeEmailControl.value === undefined ? null : this.employeeEmailControl.value,
    'license': this.licenseControl.value,
    'license_status': this.licenseStatus == '' ? this.registryValue.license_status: this.licenseStatus,
    'license_expiration': this.licenseExp  == '' ? this.registryValue.license_expiration : this.licenseExp,
    'notes': this.noteControl.value
    }
    
  }

/**
 * Realiza una solicitud HTTP para actualizar un registro de licencia con los datos actuales del formulario.
 *
 * @returns Una promesa que se resuelve cuando se completa la solicitud de actualización.
 */
httpRegistryUpdate(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      this.http.updateRegistry(this.generateRegistryOBJ()).subscribe({
          next: () => {
              resolve(); // Resuelve la promesa cuando la solicitud se completa con éxito.
          },
          error: error => {
              console.error('Error al actualizar el registro', error);
              reject(); // Rechaza la promesa en caso de error.
          }
      });
  });
}

/**
* Inicia el proceso de actualización de un registro de licencia, mostrando un indicador de carga.
* Cierra el diálogo de edición después de la actualización exitosa.
*/
async updateRegistry(): Promise<void> {
  this.isLoading = true; // Activa el indicador de carga.
  try {
      await this.httpRegistryUpdate(); // Espera a que se complete la actualización.
  } finally {
      this.isLoading = false; // Desactiva el indicador de carga.
      this.dialogRef.close(); // Cierra el diálogo de edición.
  }
}


/**
 * Realiza una solicitud HTTP para obtener la lista de áreas disponibles.
 *
 * @returns Una promesa que se resuelve con los datos de las áreas.
 */
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
        this.filterSubArea(this.registryValue.area); // Filtra las subáreas.
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
        this.filterCostCenter(this.registryValue.sub_area_name); // Filtra los centros de costo.
        resolve(); // Resuelve la promesa cuando la solicitud es exitosa.
      },
      error: error => {
        console.error('Error al obtener los centros de costo', error);
        reject(); // Rechaza la promesa en caso de error.
      }
    });
  });
}

/**
 * Realiza una solicitud HTTP para obtener la lista de empleados disponibles.
 *
 * @returns Una promesa que se resuelve con los datos de los empleados.
 */
getUsers(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.http.getUser().subscribe({
      next: response => {
        this.employee = response; // Almacena los datos de empleados en la propiedad "employee".
        resolve(); // Resuelve la promesa cuando la solicitud es exitosa.
      },
      error: error => {
        console.error('Error al obtener los empleados', error);
        reject(); // Rechaza la promesa en caso de error.
      }
    });
  });
}

/**
 * Asigna los valores extraídos del registro a actualizar en los inputs correspondientes.
 */
setInputValues(){
  this.areaControl.setValue(this.registryValue.area);
  this.subAreaControl.setValue(this.registryValue.sub_area_name);
  this.costCenterControl.setValue(this.registryValue.CC_number);
  this.employeeNameControl.setValue(this.registryValue.employee_name);
  this.employeeNumberControl.setValue(this.registryValue.employee_number);
  this.employeeEmailControl.setValue(this.registryValue.email);
  this.licenseControl.setValue(this.registryValue.license);
  this.noteControl.setValue(this.registryValue.notes);
  this.licenseExpVal= new Date(this.registryValue.license_expiration);

}
}
