import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  RouterTestingModule
} from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderFooterModule } from './modules/header-footer/header-footer.module';
import { UserService } from './services/user.service';
import { DummyDataService } from './services/dummy-data.service';
import { FPCareDataService } from './services/fpcare-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        UserService,
        DummyDataService,
        FPCareDataService
      ],
      imports: [
        RouterTestingModule,
        HeaderFooterModule,
        HttpClientTestingModule
      ]
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a span tag', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('span.title').textContent).toContain('Fair PharmaCare');
  }));
});
