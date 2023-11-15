import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'; 
import { HttpRequestService } from '../services/http/http-request.service';
import { AutenticationService } from '../services/auth/autentication.service';
import { LoaderComponent } from '../loader/loader.component';
import { Router } from '@angular/router';
import { SharedVariablesService } from '../services/sharedVriables/shared-variables.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    LoaderComponent
  ],
})
export class LoginComponent implements OnInit {
  username!:string;
  password!:string;
  isLoading:boolean = false;
  

hide = true;
imagenUrl: string = 'assets/img/KeyVisual.jpg';
  constructor(private http: HttpRequestService, private router: Router, private sharedVariables: SharedVariablesService){}
  ngOnInit(): void {

  }
  getAuth(){
    return new Promise<void>((resolve,reject)=>{
      this.http.getAuthUser(this.username,this.password).subscribe({
        next: response =>{
          const res:any = response
          this.sharedVariables.authenticateUSer = res.authenticated;
          resolve();
        },
        error: error =>{
          console.error('error ',error);
          reject();
        }
      });
    });
  }
  async submit() {
    this.isLoading = true;
    await this.getAuth()
    .then(() =>{
      this.isLoading = false;

      if(this.sharedVariables.authenticateUSer === true){
        this.router.navigate(['inventory-table']);
      }else{
        alert('usuario no existe');
      }
    }).catch(()=>{

      this.isLoading = false;
      alert('usuario no existe');
    });
      }
    
  
  
  
  
  
  
  


}
