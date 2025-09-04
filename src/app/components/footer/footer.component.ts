import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Business } from '../../data/data.service';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule],
  template: `
<footer class="bg-blackx text-white border-t border-white/10">
  <div class="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
    <!-- Address -->
    <div>
      <div class="text-white mb-2">Dirección</div>
      <div class="text-white/80" *ngIf="biz() as b">
        {{ b.address || 'Tehuacán, Puebla' }}
      </div>
    </div>

    <!-- Hours -->
    <div>
      <div class="text-white mb-2">Horarios</div>
      <div class="grid grid-cols-2 text-white/80 gap-y-1" *ngIf="biz() as b">
        <div>Lunes</div><div class="text-right">{{ b.hours?.monday || '6pm – 1am' }}</div>
        <div>Martes</div><div class="text-right">{{ b.hours?.tuesday || '6pm – 1am' }}</div>
        <div>Miércoles</div><div class="text-right">{{ b.hours?.wednesday || '6pm – 1am' }}</div>
        <div>Jueves</div><div class="text-right">{{ b.hours?.thursday || '6pm – 1am' }}</div>
        <div>Viernes</div><div class="text-right">{{ b.hours?.friday || '6pm – 1am' }}</div>
        <div>Sábado</div><div class="text-right">{{ b.hours?.saturday || '6pm – 1am' }}</div>
        <div>Domingo</div><div class="text-right">{{ b.hours?.sunday || '6pm – 1am' }}</div>
      </div>
    </div>

    <!-- Social with icons -->
    <div>
      <div class="text-white mb-2">Social</div>
      <div class="flex items-center gap-4" *ngIf="biz() as b">
        <a [attr.href]="b.instagram"
           target="_blank" rel="noopener noreferrer"
           class="group inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermillion rounded-lg px-1"
           aria-label="Instagram">
          <!-- Instagram SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               class="w-6 h-6 fill-salsa group-hover:fill-gold transition-colors" aria-hidden="true">
            <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM18 6.25a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
          </svg>
          <span class="text-white/80 group-hover:text-gold transition-colors">Instagram</span>
        </a>

        <a [attr.href]="b.facebook"
           target="_blank" rel="noopener noreferrer"
           class="group inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermillion rounded-lg px-1"
           aria-label="Facebook">
          <!-- Facebook SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               class="w-6 h-6 fill-salsa group-hover:fill-gold transition-colors" aria-hidden="true">
            <path d="M13 3h3a1 1 0 011 1v3h-3a1 1 0 00-1 1v3h4l-1 4h-3v8h-4v-8H7v-4h3V8a5 5 0 015-5z"/>
          </svg>
          <span class="text-white/80 group-hover:text-gold transition-colors">Facebook</span>
        </a>
      </div>
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
}
