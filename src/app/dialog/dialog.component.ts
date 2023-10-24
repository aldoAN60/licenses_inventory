import { Component, OnInit } from '@angular/core';
import { MatDialogModule} from '@angular/material/dialog';
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
    MatGridListModule
    
  ]
})
export class DialogComponent implements OnInit{
registryValue:any;

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
license:any;
licenseControl = new FormControl('', Validators.required);
licenseStatus:any;
licenseStatusControl= new FormControl('', Validators.required);

//note variables
note:any;
noteControl =  new FormControl('');

// license expiration variables
expiration = new FormControl<Date|null>(null);

  constructor(private http: HttpRequestService, private sharedVariables: SharedVariablesService){}
 async ngOnInit(): Promise<void> {
  this.registryValue = this.sharedVariables.updateRegistry;
  console.log(this.registryValue);

  this.setInputValues();
  await this.getArea();
  await this.getSubArea();
  await this.getCostCenter();
  await this.getUsers();
  


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
    console.log('New date selected:', event.value);
  }
  updateRegistry(){
    const area = {
    'area':this.areaControl.value,
    'sub_area_name':this.subAreaControl.value,
    'CC_number':'pendiente',
    'CC_name':this.costCenterControl.value,
    'employee_number':this.employeeNumberControl.value,
    'employee_name':this.employeeNameControl.value,
    'email':this.employeeEmailControl.value,
    'license':this.licenseControl.value,
    'license_status':'pendiente',
    'license_expiration':'pendiente',
    'notes':this.noteControl.value
    }
    
    console.log(area);
  }
  //metodo get para obtener las areas
getArea(){
  return new Promise<void>((resolve, reject) =>{
    this.http.getAreas().subscribe({
      next: response =>{
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
  // settea los valores extraidos del registro a actualizar en los inputs correspondientes
setInputValues(){
  this.areaControl.setValue(this.registryValue.area);
  this.subAreaControl.setValue(this.registryValue.sub_area_name);
  this.costCenterControl.setValue(this.registryValue.CC_number);
  this.employeeNameControl.setValue(this.registryValue.employee_name);
  this.employeeNumberControl.setValue(this.registryValue.employee_number);
  this.employeeEmailControl.setValue(this.registryValue.employee_email);
  this.licenseControl.setValue(this.registryValue.license);
  this.noteControl.setValue(this.registryValue.notes);

}
}
