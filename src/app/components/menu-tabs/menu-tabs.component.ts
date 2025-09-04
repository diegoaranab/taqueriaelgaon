import { Component, computed, effect, inject, signal } from '@angular/core';
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
              (click)="selectTab(c.id)"
              class="px-4 py-2 rounded-lg text-sm md:text-base"
              [ngClass]="activeId() === c.id ? 'bg-gold text-blackx' : 'bg-white/10'">
        {{ c.label }}
      </button>
    </div>

    <div class="mt-6 space-y-4" *ngIf="activeCategory() as cat">
      <p *ngIf="cat.notes" class="text-white/60 text-sm">{{ cat.notes }}</p>

      <div *ngFor="let item of cat.items" class="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <h3 class="font-semibold text-lg">{{ item.name }}</h3>
        </div>

        <div class="flex items-center gap-2 text-sm shrink-0">
          <ng-container *ngIf="isTaco(item); else simplePrice">
            <span class="inline-block px-2 py-1 rounded bg-white/10">
              Maíz {{ $any(item).prices?.maiz | currency:'MXN':'symbol-narrow':'1.0-0' }}
            </span>
            <span class="inline-block px-2 py-1 rounded bg-white/10">
              Harina {{ $any(item).prices?.harina | currency:'MXN':'symbol-narrow':'1.0-0' }}
            </span>
            <span class="inline-block px-2 py-1 rounded bg-vermillion">
              Con {{ $any(item).prices?.con | currency:'MXN':'symbol-narrow':'1.0-0' }}
            </span>
          </ng-container>
          <ng-template #simplePrice>
            <span class="inline-block px-2 py-1 rounded bg-white/10">
              {{ $any(item).price | currency:'MXN':'symbol-narrow':'1.0-0' }}
            </span>
          </ng-template>
        </div>
      </div>
    </div>
  </section>
  `
})
export class MenuTabsComponent {
  private data = inject(DataService);
  protected categories = signal<Category[]>([]);
  protected activeId = signal<string>('tacos');

  constructor(private analytics: AnalyticsService) {
    this.data.menu().subscribe(m => this.categories.set(m.categories));
    effect(() => {
      if (!this.categories().some(c => c.id === this.activeId())) {
        const first = this.categories()[0]?.id;
        if (first) this.activeId.set(first);
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
