import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRegistryDialogComponent } from './create-registry-dialog.component';

describe('CreateRegistryDialogComponent', () => {
  let component: CreateRegistryDialogComponent;
  let fixture: ComponentFixture<CreateRegistryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRegistryDialogComponent]
    });
    fixture = TestBed.createComponent(CreateRegistryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
