import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestApprovalListComponent } from './test-approval-list.component';

describe('TestApprovalListComponent', () => {
  let component: TestApprovalListComponent;
  let fixture: ComponentFixture<TestApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestApprovalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
