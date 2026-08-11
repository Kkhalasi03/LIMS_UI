import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportdashboardListComponent } from './reportdashboard-list.component';

describe('ReportdashboardListComponent', () => {
  let component: ReportdashboardListComponent;
  let fixture: ComponentFixture<ReportdashboardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportdashboardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportdashboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
