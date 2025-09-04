import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/analytics.service';

@Component({
  standalone: true,
  selector: 'app-consent-banner',
  imports: [CommonModule],
  styles: [`
    .banner { position: fixed; inset-inline: 0; bottom: 0; z-index: 50; }
  `],
  template: `
    <div *ngIf="!accepted"
         class="banner m-4 rounded-xl bg-black/80 text-white p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm leading-snug">
        Usamos cookies solo para analítica (GA4) y mejorar tu experiencia. ¿Aceptas?
      </p>
      <div class="flex gap-2">
        <button (click)="accept()"
                class="px-4 py-2 rounded-lg bg-vermillion text-white font-semibold">Aceptar</button>
        <button (click)="decline()"
                class="px-4 py-2 rounded-lg bg-white/10">No, gracias</button>
      </div>
    </div>
  `
})
export class ConsentBannerComponent {
  accepted = false;
  constructor(private analytics: AnalyticsService) {
    this.accepted = this.analytics.hasConsent();
    this.analytics.maybeInit();
  }
  accept() { this.analytics.giveConsent(); this.accepted = true; }
  decline() { this.analytics.revokeConsent(); this.accepted = true; }
}
