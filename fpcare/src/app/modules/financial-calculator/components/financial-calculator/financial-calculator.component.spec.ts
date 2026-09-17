import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialCalculatorComponent } from './financial-calculator.component';
import { AnnualDeductibleComponent } from '../annual-deductible/annual-deductible.component';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';

describe('FinancialCalculatorComponent', () => {
  let component: FinancialCalculatorComponent;
  let fixture: ComponentFixture<FinancialCalculatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialCalculatorComponent, AnnualDeductibleComponent ],
      imports: [ NgxMaskDirective ],
      providers: [ provideEnvironmentNgxMask() ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
