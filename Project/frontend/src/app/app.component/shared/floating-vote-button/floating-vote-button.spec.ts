import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingVoteButton } from './floating-vote-button';

describe('FloatingVoteButton', () => {
  let component: FloatingVoteButton;
  let fixture: ComponentFixture<FloatingVoteButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingVoteButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingVoteButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
