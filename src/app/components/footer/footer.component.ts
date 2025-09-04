import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Business } from '../../data/data.service';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule],
  template: `
<footer class="bg-blackx text-white border-top border-white/10">
  <div class="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3" *ngIf="biz() as b">
    <!-- Address -->
    <div>
      <div class="text-white mb-2 font-semibold">Dirección</div>
      <div class="text-white/80">
        {{ b.address || 'Tehuacán, Puebla' }}
      </div>
    </div>

    <!-- Horarios -->
    <div>
      <div class="text-white mb-2 font-semibold">Horarios</div>
      <div class="grid grid-cols-[1fr,auto] gap-y-1 text-white/80">
        <div>Lunes</div>     <div class="text-right">{{ b.hours?.['monday']    || '6pm – 1am' }}</div>
        <div>Martes</div>    <div class="text-right">{{ b.hours?.['tuesday']   || '6pm – 1am' }}</div>
        <div>Miércoles</div> <div class="text-right">{{ b.hours?.['wednesday'] || '6pm – 1am' }}</div>
        <div>Jueves</div>    <div class="text-right">{{ b.hours?.['thursday']  || '6pm – 1am' }}</div>
        <div>Viernes</div>   <div class="text-right">{{ b.hours?.['friday']    || '6pm – 1am' }}</div>
        <div>Sábado</div>    <div class="text-right">{{ b.hours?.['saturday']  || '6pm – 1am' }}</div>
        <div>Domingo</div>   <div class="text-right">{{ b.hours?.['sunday']    || '6pm – 1am' }}</div>
      </div>
    </div>

    <!-- Social -->
    <div>
      <div class="text-white mb-2 font-semibold">Síguenos</div>
      <ul class="space-y-2 text-white/80">
        <li *ngIf="b.instagram">
          <a class="hover:underline" [href]="resolveUrl(b.instagram)" target="_blank" rel="noopener">Instagram</a>
        </li>
        <li *ngIf="b.facebook">
          <a class="hover:underline" [href]="resolveUrl(b.facebook)" target="_blank" rel="noopener">Facebook</a>
        </li>
        <li *ngIf="b.whatsapp?.number">
          <a class="hover:underline" [href]="whatsappUrl(b.whatsapp?.prefill || 'Hola El Ga’on, quiero ordenar.', b)" target="_blank" rel="noopener">
            WhatsApp
          </a>
        </li>
      </ul>
    </div>
  </div>

  <div class="mx-auto max-w-6xl px-4 pb-6 text-white/60">
    © {{ year }} Taquería El Ga’on
  </div>
</footer>
  `
})
export class FooterComponent {
  private data = inject(DataService);
  readonly year = new Date().getFullYear();
  biz = this.data.businessSignal;

  /** Helpers to avoid double "https://..." when composing links */
  resolveUrl(url?: string): string | undefined {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    return 'https://' + url.replace(/^https?:\/\//i, '');
  }

  whatsappUrl(message: string, biz?: Business): string {
    const num = biz?.whatsapp?.number?.replace(/[^\d]/g, '') ?? '';
    const base = num ? `https://wa.me/${num}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(message)}`;
  }
}
