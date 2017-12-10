import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentOptionsComponent } from './recent-options.component';

describe('RecentOptionsComponent', () => {
  let component: RecentOptionsComponent;
  let fixture: ComponentFixture<RecentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
