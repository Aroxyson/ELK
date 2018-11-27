import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsTopComponent } from './notifications-top.component';

describe('NotificationsTopComponent', () => {
  let component: NotificationsTopComponent;
  let fixture: ComponentFixture<NotificationsTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
