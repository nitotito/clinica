import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnChanges {
  @Input() isLoading: boolean = false;
  progress: number = 0;
  private intervalId: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoading']) {
      if (this.isLoading) {
        this.startProgress();
      } else {
        this.finishProgress();
      }
    }
  }

  private startProgress() {
    this.progress = 0;
    this.clearTimer();

    this.intervalId = setInterval(() => {
      if (this.progress < 70) {
        this.progress += Math.random() * 8; // rápido al inicio
      } else if (this.progress < 95) {
        this.progress += Math.random() * 2; // más lento
      }

      if (this.progress > 95) {
        this.progress = 95; // nunca pasa de 95 hasta que termine
      }
    }, 300);
  }

  private finishProgress() {
    this.clearTimer();
    this.progress = 100; // completa cuando termina la carga real
    setTimeout(() => {
      this.progress = 0; // resetea para la próxima vez
    }, 500);
  }

  private clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
