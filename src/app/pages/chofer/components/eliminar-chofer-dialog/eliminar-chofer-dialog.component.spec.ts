import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarChoferDialogComponent } from './eliminar-chofer-dialog.component';

describe('EliminarChoferDialogComponent', () => {
  let component: EliminarChoferDialogComponent;
  let fixture: ComponentFixture<EliminarChoferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarChoferDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarChoferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
