import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import {RouterTestingModule} from '@angular/router/testing';
import { environment as testEnv } from '../../../environments/environment';


describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  const testUrl = 'https://test.my.gov.bc.ca/ahdc';

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
    expect(component.ahdcUrl).toBe(testEnv.ahdcUrl);
    expect(fixture.nativeElement.querySelector('a').getAttribute('href')).toBe(testEnv.ahdcUrl);
  });
});
