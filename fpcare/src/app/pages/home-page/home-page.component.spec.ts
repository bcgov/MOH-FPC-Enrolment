import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import {RouterTestingModule} from '@angular/router/testing';
import { environment as testEnv } from '../../../environments/environment';
import { environment as prodEnv } from '../../../environments/environment.prod';


describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  const testUrl = 'https://test.my.gov.bc.ca/ahdc';
  const prodUrl = 'https://my.gov.bc.ca/ahdc';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ HomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the correct AHDC URL based on the current environment', () => {
    expect(testEnv.ahdcUrl).toBe(testUrl);
    expect(prodEnv.ahdcUrl).toBe(prodUrl);
    expect(component.ahdcUrl).toBe(testEnv.ahdcUrl);
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe(testEnv.ahdcUrl);
  });
});
