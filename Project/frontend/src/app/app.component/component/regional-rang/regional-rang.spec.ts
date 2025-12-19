import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalRang } from './regional-rang';

describe('RegionalRang', () => {
  let component: RegionalRang;
  let fixture: ComponentFixture<RegionalRang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionalRang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionalRang);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
