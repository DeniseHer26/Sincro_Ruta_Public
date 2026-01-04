import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesTransporteComponent } from './unidades-transporte.component';

describe('UnidadesTransporteComponent', () => {
  let component: UnidadesTransporteComponent;
  let fixture: ComponentFixture<UnidadesTransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadesTransporteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadesTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
