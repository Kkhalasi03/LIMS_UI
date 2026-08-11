import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportdashboardListComponent } from './daily-reportdashboard-list.component';

describe('DailyReportdashboardListComponent', () => {
  let component: DailyReportdashboardListComponent;
  let fixture: ComponentFixture<DailyReportdashboardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyReportdashboardListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyReportdashboardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
