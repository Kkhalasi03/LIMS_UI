import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateEditComponent } from './state-edit.component';

describe('StateEditComponent', () => {
  let component: StateEditComponent;
  let fixture: ComponentFixture<StateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
