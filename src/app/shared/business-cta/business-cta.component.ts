import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Business } from '../../data/data.service';

@Component({
  standalone: true,
  selector: 'app-business-cta',
  imports: [CommonModule],
  template: `
  <section class="bg-blackx text-white">
    <div class="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row md:items-center gap-4">
      <div class="grow">
        <h2 class="text-2xl font-display">¿Listo para ordenar?</h2>
        <p class="text-white/70" *ngIf="biz() as b">{{ b.address }}</p>
      </div>
      <div class="flex items-center gap-3">
        <a [href]="waUrl" target="_blank" rel="noopener"
           class="px-5 py-3 rounded-lg bg-vermillion text-white font-semibold hover:opacity-90 transition">
          WhatsApp
        </a>
        <a *ngIf="biz()?.instagram" [href]="'https://instagram.com/' + biz()?.instagram" target="_blank" rel="noopener"
           class="text-white/80 hover:text-white">Instagram</a>
        <a *ngIf="biz()?.facebook" [href]="'https://facebook.com/' + biz()?.facebook" target="_blank" rel="noopener"
           class="text-white/80 hover:text-white">Facebook</a>
      </div>
    </div>
  </section>
  `
})
export class BusinessCtaComponent {
  private data = inject(DataService);
  protected biz = signal<Business | null>(null);
  protected waUrl = 'https://wa.me/';

  constructor() {
    this.data.business().subscribe(b => {
      this.biz.set(b);
      const pre = b.whatsapp?.prefill || 'Hola El Ga’on, quiero ordenar:';
      this.waUrl = this.data.whatsappUrl(pre, b);
    });
  }
}
