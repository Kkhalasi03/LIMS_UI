import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleregisterEditComponent } from './sampleregister-edit.component';

describe('SampleregisterEditComponent', () => {
  let component: SampleregisterEditComponent;
  let fixture: ComponentFixture<SampleregisterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleregisterEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleregisterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
