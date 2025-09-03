import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-hero-video',
  imports: [CommonModule],
  template: `
  <section class="relative w-full min-h-[70dvh] bg-blackx text-white flex items-center justify-center overflow-hidden">
    <ng-container *ngIf="!prefersReducedMotion; else posterTpl">
      <video
        #vid
        class="w-full h-[70dvh] object-cover"
        [attr.src]="src"
        [attr.poster]="poster"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true">
      </video>
    </ng-container>

    <ng-template #posterTpl>
      <img [src]="poster" alt="Taquería El Ga’on" class="w-full h-[70dvh] object-cover" />
    </ng-template>

    <!-- Slot for overlay content (e.g., CTA button) -->
    <ng-content></ng-content>
  </section>
  `,
})
export class HeroVideoComponent implements AfterViewInit, OnDestroy {
  /** Path to the MP4 video. Replace this with the real Sora export when ready. */
  @Input() src: string = '/assets/video/hero_loop.mp4';

  /** Poster image shown on load and for reduced-motion users. */
  @Input() poster: string = '/assets/images/hero/poster.svg';

  @ViewChild('vid') vid?: ElementRef<HTMLVideoElement>;
  prefersReducedMotion = false;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    // Reduced motion preference (safe guard for SSR if ever enabled)
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Pause video when off-screen to save battery/data
    if (this.vid && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const v = this.vid.nativeElement;
      this.observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
          v.pause();
        } else if (v.paused) {
          v.play().catch(() => {});
        }
      }, { threshold: 0.1 });
      this.observer.observe(v);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
