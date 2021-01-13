import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FPCareToggleComponent } from './toggle.component';

describe('FPCareToggleComponent', () => {
  let component: FPCareToggleComponent;
  let fixture: ComponentFixture<FPCareToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FPCareToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FPCareToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have both options unselected on init', () => {
    expect(component.data).toBeUndefined();
    expect(fixture.nativeElement.querySelectorAll('.custom-control-input:checked').length).toEqual( 0 );
  });

  it('should allow for toggling values', () => {
    component.data = true;
    fixture.detectChanges();

    let selectedInput = fixture.nativeElement.querySelectorAll('.custom-control-input:checked');
    expect(selectedInput.length).toEqual( 1 );
    expect(selectedInput[0].value).toEqual('Yes');

    component.data = false;
    fixture.detectChanges();

    selectedInput = fixture.nativeElement.querySelectorAll('.custom-control-input:checked');
    expect(selectedInput.length).toEqual( 1 );
    expect(selectedInput[0].value).toEqual('No');
  });

  it('should display text for component', () => {
    component.label = 'This a test';
    fixture.detectChanges();

    const legendText = fixture.nativeElement.querySelector('legend');
    expect( legendText.textContent).toContain('This a test');
  });
});
