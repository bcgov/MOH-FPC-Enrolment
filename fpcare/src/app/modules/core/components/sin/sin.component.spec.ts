import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SinComponent } from './sin.component';
import { ValidationService } from '../../../../services/validation.service';

describe('SinComponent', () => {
  let component: SinComponent;
  let fixture: ComponentFixture<SinComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SinComponent ],
      imports: [ FormsModule, NgxMaskDirective ],
      providers: [
        NgForm,
        ValidationService,
        provideNgxMask()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
