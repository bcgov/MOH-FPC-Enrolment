import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  SharedCoreModule,
  PageFrameworkComponent,
  PageSectionComponent,
  CheckboxComponent,
  ErrorContainerComponent,
} from 'moh-common-lib-angular';

import { ConsentComponent } from './consent.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideEnvironmentNgxMask } from 'ngx-mask';

describe('ConsentComponent', () => {
  let component: ConsentComponent;
  let fixture: ComponentFixture<ConsentComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ConsentComponent],
        imports: [
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule,
          SharedCoreModule,
          HttpClientTestingModule,
          PageFrameworkComponent,
          PageSectionComponent,
          CheckboxComponent,
          ErrorContainerComponent,
        ],
        providers: [provideEnvironmentNgxMask()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
