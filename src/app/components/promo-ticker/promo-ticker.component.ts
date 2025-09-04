import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Promo } from '../../data/data.service';
import { AnalyticsService } from '../../core/analytics.service';

@Component({
  standalone: true,
  selector: 'app-promo-ticker',
  imports: [CommonModule],
  template: `
  <section class="bg-blackx text-white border-t border-white/10">
    <div class="mx-auto max-w-6xl px-4 py-3" aria-live="polite">
      <div *ngIf="promo() as p" class="flex items-center gap-3">
        <span class="inline-block px-2 py-1 rounded bg-gold text-blackx text-xs font-semibold">PROMO</span>
        <span class="text-sm md:text-base">
          {{ p.title }}
          <span *ngIf="p.body" class="text-white/70">— {{ p.body }}</span>
        </span>
        <a *ngIf="p.href" [href]="p.href" class="ml-auto text-vermillion hover:underline text-sm">{{ p.cta || 'Ver más' }}</a>
      </div>
    </div>
  </section>
  `
})
export class PromoTickerComponent implements OnInit, OnDestroy {
  private data = inject(DataService);
  private analytics = inject(AnalyticsService);

  promo = signal<Promo | null>(null);
  private list: Promo[] = [];
  private idx = 0;
  private timer: any;

  ngOnInit(): void {
    this.data.promos().subscribe(d => {
      this.list = d.active || [];
      this.idx = 0;
      this.update();

      // Respect reduced motion: only rotate if not reduced
      const prefersReduced = typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (!prefersReduced && this.list.length > 1) {
        this.timer = setInterval(() => {
          this.idx = (this.idx + 1) % this.list.length;
          this.update();
        }, 6500);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private seen = new Set<string>();

  private update() {
    const currentPromo = this.list[this.idx] ?? null;
    this.promo.set(currentPromo);
    const key = (currentPromo as any)?.id || currentPromo?.title || JSON.stringify(currentPromo);
    if (key && !this.seen.has(key)) {
      this.seen.add(key);
      this.analytics.trackEvent('promo_seen', { id: key });
    }
  }
}
