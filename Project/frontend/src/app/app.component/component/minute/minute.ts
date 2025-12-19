import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-minute',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minute.html',
  styleUrls: ['./minute.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // 🔑 clé
})
export class MinuteComponent implements OnInit, OnDestroy {

  @Input() endDateString!: string;

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  isElectionLive = true;

  private sub?: Subscription;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub = timer(0, 1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  private updateCountdown(): void {
    const now = Date.now();
    const end = new Date(this.endDateString).getTime();
    const diff = end - now;

    if (diff <= 0) {
      this.days = this.hours = this.minutes = this.seconds = 0;
      this.isElectionLive = false;
      this.sub?.unsubscribe();
      this.cdr.markForCheck();
      return;
    }

    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    this.minutes = Math.floor((diff / (1000 * 60)) % 60);
    this.seconds = Math.floor((diff / 1000) % 60);

    // 🔁 rafraîchit UNIQUEMENT ce composant
    this.cdr.markForCheck();
  }

  formatNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
