import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadTransporteFormDialogComponent } from './unidad-transporte-form-dialog.component';

describe('UnidadTransporteFormDialogComponent', () => {
  let component: UnidadTransporteFormDialogComponent;
  let fixture: ComponentFixture<UnidadTransporteFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadTransporteFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadTransporteFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
