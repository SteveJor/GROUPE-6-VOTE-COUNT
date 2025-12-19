import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Minute } from './minute';

describe('Minute', () => {
  let component: Minute;
  let fixture: ComponentFixture<Minute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Minute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Minute);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
