import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { SharedCoreModule } from 'moh-common-lib';

import { FinancialInputComponent } from './financial-input.component';

describe('FinancialInputComponent', () => {
  let component: FinancialInputComponent;
  let fixture: ComponentFixture<FinancialInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialInputComponent],
      imports: [
        TextMaskModule,
        SharedCoreModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
