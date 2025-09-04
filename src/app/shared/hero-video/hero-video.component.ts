import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-hero-video',
  imports: [CommonModule],
  template: `
  <section class="relative w-full min-h-[70dvh] bg-blackx text-white flex items-center justify-center overflow-hidden">
    <!-- We no longer bail out on reduced motion for the hero -->
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

    <!-- Slot for overlay content (e.g., CTA button) -->
    <ng-content></ng-content>
  </section>
  `,
})
export class HeroVideoComponent implements AfterViewInit, OnDestroy {
  /** Base-href-friendly paths (GH Pages) — these files exist in public/assets/... */
  @Input() src: string = 'assets/video/hero_loop.mp4';
  @Input() poster: string = 'assets/images/hero/poster.jpg';

  /**
   * Force autoplay even if OS/browser reports "prefers-reduced-motion: reduce".
   * Keep this true for the hero; you can set [forceAutoplay]="false" elsewhere if needed.
   */
  @Input() forceAutoplay: boolean = true;

  @ViewChild('vid') vid?: ElementRef<HTMLVideoElement>;

  autoplayBlocked = false;
  private firstPlayed = false;
  private observer?: IntersectionObserver;
  private gestureHandlersBound = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  private get isBrowser() { return isPlatformBrowser(this.platformId); }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      // On the server: do nothing. Avoid touching the video element.
      return;
    }
    const v = this.vid?.nativeElement as HTMLVideoElement | undefined;
    if (!v) return;

    // Reload if supported (some shims don’t implement .load)
    try { (v as any).load?.(); } catch {}

    // Autoplay attempt with catch to avoid unhandled promise rejections
    try { v.play?.().catch(() => {}); } catch {}

    // Attach visibility handler in browser only
    document.addEventListener('visibilitychange', this.onVisibility, false);
  }

  private onFirstPlay() {
    if (!this.isBrowser) return;
    if (this.firstPlayed) return;
    this.firstPlayed = true;

    const v = this.vid?.nativeElement;
    if (!v) return;

    // Manage battery/data with IO AFTER first success (don’t pause pre-emptively)
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
          v.pause();
        } else if (v.paused) {
          v.play?.().catch(err => {
            console.warn('[hero] IO resume blocked', err?.name || err);
            this.autoplayBlocked = true;
            this.bindFirstUserGesture();
          });
        }
      }, { root: null, rootMargin: '25% 0px', threshold: 0.1 });
      this.observer.observe(v);
    }
  }

  private bindFirstUserGesture() {
    if (!this.isBrowser) return;
    if (this.gestureHandlersBound) return;
    this.gestureHandlersBound = true;

    const resume = () => {
      const v = this.vid?.nativeElement;
      if (!v) return;
      (v as any).load?.();
      v.muted = true;
      const p = v.play?.();
      if (p) {
        p.then(() => {
          console.info('[hero] resumed after gesture');
          this.autoplayBlocked = false;
          this.onFirstPlay();
          unbind();
        }).catch(err => {
          console.warn('[hero] gesture resume failed', err?.name || err);
        });
      }
    };

    const unbind = () => {
      window.removeEventListener('pointerdown', onAny, { capture: true } as any);
      window.removeEventListener('keydown',     onAny, { capture: true } as any);
      window.removeEventListener('touchstart',  onAny, { capture: true } as any);
      window.removeEventListener('wheel',       onAny, { capture: true } as any);
    };

    const onAny = () => resume();

    window.addEventListener('pointerdown', onAny, { once: true, capture: true } as any);
    window.addEventListener('keydown',     onAny, { once: true, capture: true } as any);
    window.addEventListener('touchstart',  onAny, { once: true, capture: true } as any);
    window.addEventListener('wheel',       onAny, { once: true, capture: true } as any);
  }

  private onVisibility = () => {
    if (!this.isBrowser) return;
    const v = this.vid?.nativeElement;
    if (!v) return;
    if (document.hidden) {
      v.pause();
    } else if (v.paused) {
      const p = v.play?.();
      if (p) {
        p.then(() => {
          console.info('[hero] resumed on visibility');
          this.autoplayBlocked = false;
        }).catch(err => {
          console.warn('[hero] resume on visibility blocked', err?.name || err);
          this.autoplayBlocked = true;
          this.bindFirstUserGesture();
        });
      }
    }
  };

  tapToPlay(evt: Event) {
    if (!this.isBrowser) return;
    evt.stopPropagation();
    const v = this.vid?.nativeElement;
    if (!v) return;
    (v as any).load?.();
    v.muted = true;
    const p = v.play?.();
    if (p) {
      p.then(() => {
        console.info('[hero] user tap → playing');
        this.autoplayBlocked = false;
        this.onFirstPlay();
      }).catch(err => {
        console.warn('[hero] user tap failed', err?.name || err);
      });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.isBrowser) {
      document.removeEventListener('visibilitychange', this.onVisibility, false);
    }
  }

  private queryReducedMotion(): boolean {
    if (!this.isBrowser) return false;
    try {
      return typeof window !== 'undefined'
        && 'matchMedia' in window
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }
}
