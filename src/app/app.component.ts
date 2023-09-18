import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  panelOpenState = false;

  title = 'licenses_inventory';

  label1:boolean = true;
  label2:boolean = false;
  label3:boolean = false;

  usuarios: any;
  registryCounts:any;

constructor( private http: HttpClient ){

}
  ngOnInit(): void {
   
    this.label1 = true;
    this.label2 = false;
    this.label3 = false;
    
    this.getRegistryCounts();
  }

  changeLabel(selectedLabel:string) {
    
    if (selectedLabel === 'label1') {
      this.label1 = true;
      this.label2 = false;
      this.label3 = false;
    }
    if (selectedLabel === 'label2') {
      this.label1 = false;
      this.label2 = true;
      this.label3 = false;
    }
    if (selectedLabel === 'label3') {
      this.label1 = false;
      this.label2 = false;
      this.label3 = true;
    }
  }
    getRegistryCounts(){
      const url = 'http://10.23.104.56:8000/api/total-Licenses';
      this.http.get<any>(url).pipe(
        tap((data)=> {
          this.registryCounts = data;
          console.log(this.registryCounts);
        }),
        catchError((error:any)=>{
          console.error(error);
          return of(null);
        })
      ).subscribe();

    }
}
