import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaQrComponent } from './asistencia-qr.component';

describe('AsistenciaQrComponent', () => {
  let component: AsistenciaQrComponent;
  let fixture: ComponentFixture<AsistenciaQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciaQrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsistenciaQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
