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
        [src]="src"
        [poster]="poster"
        autoplay
        muted
        loop
        playsinline
        webkit-playsinline
        preload="metadata"
        aria-hidden="true">
        <source [src]="src" type="video/mp4" />
      </video>

      <!-- Fallback overlay if autoplay is blocked -->
      <button
        *ngIf="autoplayBlocked"
        (click)="tapToPlay($event)"
        class="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
        <span class="px-5 py-3 rounded-lg bg-vermillion text-white font-semibold shadow hover:opacity-90 transition">
          Tocar para reproducir
        </span>
      </button>
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
  /** Path to the MP4 video. */
  @Input() src: string = 'assets/video/hero_loop.mp4';

  /** Poster image shown on load and for reduced-motion users. */
  @Input() poster: string = 'assets/images/hero/poster.jpg';

  @ViewChild('vid') vid?: ElementRef<HTMLVideoElement>;
  prefersReducedMotion = false;
  autoplayBlocked = false;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    // Respect reduced motion (safe-guard for SSR if ever enabled)
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    if (this.prefersReducedMotion) return;

    const v = this.vid?.nativeElement;
    if (!v) return;

    // Make iOS Safari happy: set properties and attributes before attempting play
    v.muted = true;
    (v as any).playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.preload = 'metadata';

    const tryPlay = () => v.play().then(() => {
      this.autoplayBlocked = false;
    }).catch(() => {
      // If blocked, show tap overlay
      this.autoplayBlocked = true;
    });

    // Try immediately and once the media can play
    tryPlay();
    v.addEventListener('canplay', () => tryPlay(), { once: true });

    // Pause when off-screen, play when on-screen (saves battery/data)
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) v.pause();
        else if (v.paused) v.play().catch(() => { this.autoplayBlocked = true; });
      }, { threshold: 0.1 });
      this.observer.observe(v);
    }
  }

  tapToPlay(evt: Event) {
    evt.stopPropagation();
    const v = this.vid?.nativeElement;
    if (!v) return;
    v.muted = true; // keep muted for autoplay policy
    v.play().then(() => { this.autoplayBlocked = false; }).catch(() => { /* keep overlay */ });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
