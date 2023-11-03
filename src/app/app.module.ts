import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterInputComponent } from './filter-input/filter-input.component';
import { RegistryTableComponent } from './registry-table/registry-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CommonModule } from '@angular/common';

import { MomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
@NgModule({
    declarations: [
        AppComponent,
        FilterInputComponent,
        
        
        
    ],
    providers: [ 
        { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RegistryTableComponent,
        MatSlideToggleModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        CommonModule,
        MomentDateModule,
        MatDatepickerModule,
        MatNativeDateModule,
        
        
    ]
})
export class AppModule { }
