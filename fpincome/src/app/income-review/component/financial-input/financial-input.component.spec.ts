import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';
import {
  SharedCoreModule,
  ErrorContainerComponent,
} from 'moh-common-lib-angular';

import { FinancialInputComponent } from './financial-input.component';

describe('FinancialInputComponent', () => {
  let component: FinancialInputComponent;
  let fixture: ComponentFixture<FinancialInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FinancialInputComponent],
        imports: [
          NgxMaskDirective,
          SharedCoreModule,
          FormsModule,
          ReactiveFormsModule,
          ErrorContainerComponent,
        ],
        providers: [provideEnvironmentNgxMask()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
