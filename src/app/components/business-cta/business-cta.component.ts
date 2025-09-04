import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Business } from '../../data/data.service';
import { AnalyticsService } from '../../core/analytics.service';

@Component({
  standalone: true,
  selector: 'app-business-cta',
  imports: [CommonModule],
  template: `
  <section class="bg-blackx text-white">
    <div class="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row md:items-center gap-4">
      <div class="grow">
        <h2 class="text-2xl font-display">¿Listo para ordenar?</h2>
        <p class="text-white/70" *ngIf="biz() as b">
          <a [href]="mapsUrl" target="_blank" rel="noopener" (click)="onMapsClick()"
             class="hover:text-gold transition-colors">{{ b.address }}</a>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <a [href]="waUrl" target="_blank" rel="noopener" (click)="onWhatsAppClick()"
           class="px-5 py-3 rounded-lg bg-vermillion text-white font-semibold hover:opacity-90 transition">
          WhatsApp
        </a>
        <a *ngIf="biz()?.instagram" [attr.href]="biz()?.instagram" target="_blank" rel="noopener"
           class="text-white/80 hover:text-white">Instagram</a>
        <a *ngIf="biz()?.facebook" [attr.href]="biz()?.facebook" target="_blank" rel="noopener"
           class="text-white/80 hover:text-white">Facebook</a>
      </div>
    </div>
  </section>
  `
})
export class BusinessCtaComponent {
  private data = inject(DataService);
  protected biz = this.data.businessSignal;
  protected waUrl = 'https://wa.me/';
  protected mapsUrl = 'https://maps.app.goo.gl/UxpdeZjwFthaKxne7';

  constructor(private analytics: AnalyticsService) {
    effect(() => {
      const b = this.biz();
      const pre = b?.whatsapp?.prefill || 'Hola El Ga’on, quiero ordenar:';
      this.waUrl = this.whatsappUrl(pre, b);
    });
  }

  whatsappUrl(message: string, biz?: Business | null): string {
    const num = biz?.whatsapp?.number?.replace(/[^\d]/g, '') ?? '';
    const base = num ? `https://wa.me/${num}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  onWhatsAppClick() {
    this.analytics.trackEvent('whatsapp_click', { location: 'footer_cta' });
  }

  onMapsClick() {
    this.analytics.trackEvent('maps_click', { location: 'ubicacion_page' });
  }
}
