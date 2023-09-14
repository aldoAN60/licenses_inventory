import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryTableComponent } from './registry-table.component';

describe('RegistryTableComponent', () => {
  let component: RegistryTableComponent;
  let fixture: ComponentFixture<RegistryTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistryTableComponent]
    });
    fixture = TestBed.createComponent(RegistryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
