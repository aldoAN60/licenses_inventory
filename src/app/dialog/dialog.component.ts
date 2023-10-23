import { Component, OnInit } from '@angular/core';
import { MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { HttpRequestService } from '../services/http/http-request.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports:[
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule
  ]
})
export class DialogComponent implements OnInit{
  
area:any;
selected = 'sexoo';

  constructor(private http: HttpRequestService){}
  ngOnInit(): void {
    
  }
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

}
