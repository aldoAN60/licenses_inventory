import { Component,OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';


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
    
  }

  getDate(){
    const fecha = new Date();
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // ¡+1 porque los meses se indexan desde 0!
    const yyyy = fecha.getFullYear();
    return this.fechaActual = `${dd}-${mm}-${yyyy}`;
  }
}
