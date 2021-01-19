import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNoticeComponent } from './collection-notice.component';
import { ModalModule } from 'ngx-bootstrap';

describe('CollectionNoticeComponent', () => {
  let component: CollectionNoticeComponent;
  let fixture: ComponentFixture<CollectionNoticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionNoticeComponent],
      imports: [ModalModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
