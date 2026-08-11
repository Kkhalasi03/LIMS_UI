import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bEditComponent } from './b2b-edit.component';

describe('B2bEditComponent', () => {
  let component: B2bEditComponent;
  let fixture: ComponentFixture<B2bEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [B2bEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2bEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
