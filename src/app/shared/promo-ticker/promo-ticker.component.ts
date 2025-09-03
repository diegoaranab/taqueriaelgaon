import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Promo } from '../../data/data.service';

@Component({
  standalone: true,
  selector: 'app-promo-ticker',
  imports: [CommonModule],
  template: `
  <section class="bg-blackx text-white border-t border-white/10">
    <div class="mx-auto max-w-6xl px-4 py-3" aria-live="polite">
      <div *ngIf="promo() as p" class="flex items-center gap-3">
        <span class="inline-block px-2 py-1 rounded bg-gold text-blackx text-xs font-semibold">PROMO</span>
        <span class="text-sm md:text-base">{{ p.title }} <span *ngIf="p.body" class="text-white/70">— {{ p.body }}</span></span>
        <a *ngIf="p.href" [href]="p.href" class="ml-auto text-vermillion hover:underline text-sm">{{ p.cta || 'Ver más' }}</a>
      </div>
    </div>
  </section>
  `
})
export class PromoTickerComponent implements OnInit, OnDestroy {
  private data = inject(DataService);
  protected list: Promo[] = [];
  protected idx = 0;
  protected promo = signal<Promo | null>(null);
  private timer?: any;
  private reduced = false;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    this.data.promos().subscribe(p => {
      this.list = p.active || [];
      this.idx = 0;
      this.update();
      if (!this.reduced && this.list.length > 1) {
        this.timer = setInterval(() => { this.idx = (this.idx + 1) % this.list.length; this.update(); }, 6500);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private update() { this.promo.set(this.list[this.idx] ?? null); }
}
