import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterInputComponent } from './filter-input/filter-input.component';
import { RegistryTableComponent } from './registry-table/registry-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@NgModule({
    declarations: [
        AppComponent,
        FilterInputComponent,
        
        
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RegistryTableComponent,
        MatSlideToggleModule,
        
    ]
})
export class AppModule { }
