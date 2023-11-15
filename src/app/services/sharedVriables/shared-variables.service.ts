import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedVariablesService {
updateRegistry:any; //variable que obtiene el registro que se va a actualizar de la tabla y la muestra en el modal de componente dialog
reloadRequested:boolean = false;
authenticateUSer:boolean = false;
constructor() { }

}



