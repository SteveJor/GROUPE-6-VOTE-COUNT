import { ComponentFixture, TestBed } from '@angular/core/testing';
import {PasswordConf} from './password-conf';

describe('PasswordConf', () => {
  let component: PasswordConf;
  let fixture: ComponentFixture<PasswordConf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordConf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordConf);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
