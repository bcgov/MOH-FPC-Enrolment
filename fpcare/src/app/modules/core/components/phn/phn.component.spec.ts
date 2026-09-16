import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import {FormsModule, NgForm} from '@angular/forms';
import {NgxMaskDirective, provideEnvironmentNgxMask} from 'ngx-mask';
import {PhnComponent} from './phn.component';
import {ValidationService} from '../../../../services/validation.service';

describe('PhnComponent', () => {
  let component: PhnComponent;
  let fixture: ComponentFixture<PhnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhnComponent ],
      imports: [ FormsModule, NgxMaskDirective ],
      providers: [
        NgForm,
        ValidationService,
        provideEnvironmentNgxMask()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
