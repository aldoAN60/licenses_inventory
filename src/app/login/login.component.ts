import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


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
  ],
})
export class LoginComponent {
  constructor(private sanitizer: DomSanitizer){}
  
  hide = true;
  imagenUrl: string = 'assets/img/KeyVisual.jpg';
  // setImage(url: string){
  //   this.imagenUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }
}
