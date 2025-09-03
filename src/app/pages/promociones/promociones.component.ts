import { Component } from '@angular/core';
import { PromoTickerComponent } from '../../shared/promo-ticker/promo-ticker.component';

@Component({
  standalone: true,
  selector: 'app-promociones',
  imports: [PromoTickerComponent],
  template: `
    <section class="bg-blackx min-h-[40svh]">
      <app-promo-ticker></app-promo-ticker>
      <div class="mx-auto max-w-6xl px-4 py-8 text-white/80">
        Más promociones próximamente.
      </div>
    </section>
  `
})
export class PromocionesComponent {}
