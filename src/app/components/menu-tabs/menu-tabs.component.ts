import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DataService, Category, TacoItem } from '../../data/data.service';
import { AnalyticsService } from '../../core/analytics.service';

@Component({
  standalone: true,
  selector: 'app-menu-tabs',
  imports: [CommonModule, CurrencyPipe],
  template: `
  <section class="bg-blackx text-white px-4 py-8 mx-auto max-w-6xl">
    <h1 class="text-3xl md:text-4xl font-display mb-4">Menú</h1>

    <div class="flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
      <button *ngFor="let c of categories()"
              type="button"
              (click)="selectTab(c.id)"
              class="px-3 py-2 rounded-t border border-white/10 border-b-0"
              [class.bg-white]="c.id === activeId()"
              [class.text-blackx]="c.id === activeId()"
              [attr.aria-pressed]="c.id === activeId()">
        {{ c.label }}
      </button>
    </div>

    <div class="bg-cream p-4 text-blackx rounded-b shadow-inner">
      <ng-container *ngIf="activeCategory() as cat">
        <div class="grid gap-3">
          <div *ngFor="let item of cat.items" class="flex items-start justify-between border-b border-black/10 pb-2">
            <div>
              <div class="font-semibold">{{ item.name }}</div>

              <ng-container *ngIf="!isTaco(item)">
                <div class="text-sm text-black/70" *ngIf="$any(item)?.desc">
                  {{ $any(item)?.desc }}
                </div>
              </ng-container>

              <div class="flex gap-2 mt-1" *ngIf="isTaco(item)">
                <span class="inline-block px-2 py-1 rounded bg-white/10">
                  Maíz {{ $any(item).prices.maiz | currency:'MXN':'symbol-narrow':'1.0-0' }}
                </span>
                <span class="inline-block px-2 py-1 rounded bg-white/10">
                  Harina {{ $any(item).prices.harina | currency:'MXN':'symbol-narrow':'1.0-0' }}
                </span>
                <span class="inline-block px-2 py-1 rounded bg-vermillion text-white">
                  Con {{ $any(item).prices.con | currency:'MXN':'symbol-narrow':'1.0-0' }}
                </span>
              </div>
            </div>

            <div *ngIf="!isTaco(item)" class="shrink-0">
              <span class="inline-block px-2 py-1 rounded bg-white/10">
                {{ $any(item)?.price | currency:'MXN':'symbol-narrow':'1.0-0' }}
              </span>
            </div>
          </div>
        </div>

        <div *ngIf="cat.notes" class="mt-3 text-xs text-black/60">{{ cat.notes }}</div>
      </ng-container>
    </div>
  </section>
  `
})
export class MenuTabsComponent {
  private data = inject(DataService);
  private analytics = inject(AnalyticsService);

  protected categories = signal<Category[]>([]);
  protected activeId = signal<string>('tacos');

  constructor() {
    this.data.menu().subscribe(m => {
      this.categories.set(m.categories || []);
      if (!this.categories().some(c => c.id === this.activeId())) {
        const first = this.categories()[0];
        if (first) this.activeId.set(first.id);
      }
    });
  }

  selectTab(id: string) {
    this.activeId.set(id);
    this.analytics.trackEvent('menu_tab_select', { tab: id });
  }

  protected activeCategory = computed(() =>
    this.categories().find(c => c.id === this.activeId()) ?? null
  );

  protected isTaco(item: any): item is TacoItem {
    return !!item?.prices && typeof item.prices.maiz === 'number';
  }
}
