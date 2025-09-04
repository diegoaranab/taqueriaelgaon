import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Business } from '../../data/data.service';

@Component({
  standalone: true,
  selector: 'app-contacto',
  imports: [CommonModule],
  template: `
  <section class="bg-blackx text-white">
    <div class="mx-auto max-w-6xl px-4 py-10">
      <h1 class="text-3xl md:text-4xl font-display mb-6">Contacto</h1>

      <ng-container *ngIf="biz as b">
        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <div class="text-white/80">Dirección</div>
            <div class="font-medium">{{ b.address || 'Tehuacán, Puebla' }}</div>
          </div>

          <div class="space-y-3">
            <div class="text-white/80">Teléfono</div>
            <div class="font-medium">
              <a [href]="'tel:+52' + (b.whatsapp?.number || '2382489890')" class="hover:text-gold transition-colors">
                +52 {{ (b.whatsapp?.number || '2382489890') }}
              </a>
            </div>
          </div>

          <div class="space-y-3">
            <div class="text-white/80">Instagram</div>
            <div class="font-medium">
              <a [attr.href]="b.instagram || 'https://www.instagram.com/taqueria_el_gaon'"
                 target="_blank" rel="noopener"
                 class="hover:text-gold transition-colors">
                 @taqueria_el_gaon
              </a>
            </div>
          </div>

          <div class="space-y-3">
            <div class="text-white/80">Facebook</div>
            <div class="font-medium">
              <a [attr.href]="b.facebook || 'https://www.facebook.com/p/Taquería-El-Gaon-61574898375073'"
                 target="_blank" rel="noopener"
                 class="hover:text-gold transition-colors">
                 Taquería El Ga’on
              </a>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <a [href]="wa(b)" class="inline-flex items-center px-5 py-3 rounded-xl bg-vermillion text-white font-semibold hover:opacity-90 transition">
            WhatsApp
          </a>
        </div>
      </ng-container>
    </div>
  </section>
  `
})
export class ContactoComponent {
  private data = inject(DataService);
  biz?: Business;

  constructor() {
    this.data.business().subscribe(b => this.biz = b);
  }

  wa(b: Business | undefined): string {
    const pre = b?.whatsapp?.prefill || 'Hola El Ga’on, quiero ordenar:';
    return this.data.whatsappUrl(pre, b);
  }
}
