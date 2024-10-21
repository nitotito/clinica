import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoCalificacionesComponent } from './grafico-calificaciones.component';

describe('GraficoCalificacionesComponent', () => {
  let component: GraficoCalificacionesComponent;
  let fixture: ComponentFixture<GraficoCalificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoCalificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
