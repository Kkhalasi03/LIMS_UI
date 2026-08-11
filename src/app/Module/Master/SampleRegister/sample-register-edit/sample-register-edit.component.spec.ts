import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleRegisterEditComponent } from './sample-register-edit.component';

describe('SampleRegisterEditComponent', () => {
  let component: SampleRegisterEditComponent;
  let fixture: ComponentFixture<SampleRegisterEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleRegisterEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleRegisterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
