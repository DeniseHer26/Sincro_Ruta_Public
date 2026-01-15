import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoferFormDialogComponent } from './chofer-form-dialog.component';

describe('ChoferFormDialogComponent', () => {
  let component: ChoferFormDialogComponent;
  let fixture: ComponentFixture<ChoferFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoferFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoferFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
