import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovocontatoComponent } from './novocontato.component';

describe('NovocontatoComponent', () => {
  let component: NovocontatoComponent;
  let fixture: ComponentFixture<NovocontatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NovocontatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovocontatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
