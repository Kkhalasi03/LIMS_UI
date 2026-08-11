import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleregisterListComponent } from './sampleregister-list.component';

describe('SampleregisterListComponent', () => {
  let component: SampleregisterListComponent;
  let fixture: ComponentFixture<SampleregisterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleregisterListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleregisterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
