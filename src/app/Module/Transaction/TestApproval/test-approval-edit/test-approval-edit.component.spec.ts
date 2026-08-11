import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestApprovalEditComponent } from './test-approval-edit.component';

describe('TestApprovalEditComponent', () => {
  let component: TestApprovalEditComponent;
  let fixture: ComponentFixture<TestApprovalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestApprovalEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestApprovalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
