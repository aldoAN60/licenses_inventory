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
 async ngOnInit(): Promise<void> {
  this.registryValue = this.sharedVariables.updateRegistry;
  
  this.setInputValues();
  await this.getArea();
  await this.getSubArea();
  await this.getCostCenter();
  await this.getUsers();
  this.isLoading = false;


    this.areaControl.valueChanges.subscribe(selectAreaValue =>{
      this.filterSubArea(selectAreaValue);
    });

    this.subAreaControl.valueChanges.subscribe(selectSubAreaValue =>{
      if (selectSubAreaValue) {
        this.filterCostCenter(selectSubAreaValue);
      }
    });


  }
filterSubArea(areaName:string){
  const filterSubArea = this.sub_area.filter((subArea:any) => subArea.belong_area === areaName);
  this.sub_area_filtered = filterSubArea;
}
filterCostCenter(sub_area_name:string){
  const filterCC = this.costCenter.filter((costCenter:any) => costCenter.sub_area_name === sub_area_name);
  this.costCenterFiltered = filterCC;
}

  onDateChange(event: any): void {
    this.licenseExp = this.formatDate(event.value);
    this.licenseStatus = this.activeOrExpired(this.licenseExp);
  }

  formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // El mes comienza en 0
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  activeOrExpired(inputDate: string): string {
    const formattedDate = this.formatDate(inputDate);
    const currentDate = this.formatDate(new Date().toString());
  return formattedDate > currentDate ? 'active' : 'expired'
  }
  lifeTimeFunc():void{
      this.licenseExpVal = new Date(''); // Establece el valor del input en una cadena vacía
      this.unknownExp = false;
      this.licenseExp ='9999-12-31';
      this.licenseStatus = 'active';
  }
  unknownExpFunc(){
    this.licenseExpVal = new Date(''); // Establece el valor del input en una cadena vacía
    this.lifeTime = false;
    this.licenseExp ='2000-01-01';
    this.licenseStatus = 'active';
  }

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
  httpRegistryUpdate(){
    console.log(this.generateRegistryOBJ());
  return new Promise<void>((resolve, reject) =>{
    this.http.updateRegistry(this.generateRegistryOBJ()).subscribe({
      next: ()=>{
        resolve();
      },
      error: error =>{
        console.log('error', error);
        reject();
      }
    });
  }); 
  }
  async updateRegistry(){
    this.isLoading = true;
    await this.httpRegistryUpdate()
    .then(() => {
      this.isLoading = false;
      this.dialogRef.close();
    })
    .catch(() =>{

    });
  }

  //metodo get para obtener las areas
getArea(){
  return new Promise<void>((resolve, reject) =>{
    this.http.getAreas().subscribe({
      next: response => {
        this.area = response;
        resolve();
      },
      error: error=>{
        console.error('error',error);
        reject();
      }
    });
  });
}
//metodo get para obtener las sub areas 
getSubArea(){
  return new Promise<void>((resolve, reject) =>{
    this.http.getSubAreas().subscribe({
      next: response => {
        this.sub_area = response;
        this.filterSubArea(this.registryValue.area);
        resolve();
      },
      error:error => {
        console.error('error', error);
        reject();
      }
    });
  });
}
getCostCenter(){
  return new Promise<void>((resolve, reject)=>{
    this.http.getCostCenter().subscribe({
      next: response => {
        this.costCenter = response;
        this.filterCostCenter(this.registryValue.sub_area_name);
        resolve();
      },
      error:error => {
        console.error('error',error);
        reject();
      }
    });
  });
}
getUsers(){
    return new Promise<void>((resolve,reject) => {
      this.http.getUser().subscribe({
        next: response => {
          this.employee = response;
        resolve();
        },
        error:error =>{
          console.error('error',error);
          reject();
        }
      });
    });
}
  // asigna los valores extraidos del registro a actualizar en los inputs correspondientes
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
