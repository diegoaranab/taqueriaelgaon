import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-ubicacion',
  imports: [CommonModule],
  template: `
  <section class="bg-blackx text-white">
    <div class="mx-auto max-w-6xl px-4 py-8">
      <h1 class="text-3xl md:text-4xl font-display mb-4">Ubicación</h1>
      <p class="text-white/70 mb-4">2 Poniente #218, Centro, Tehuacán, Puebla.</p>

      <div class="rounded-xl overflow-hidden border border-white/10">
        <!-- Preview image; clicking loads the iframe -->
        <button *ngIf="!loaded" (click)="loadMap()" class="block w-full text-left group">
          <img src="./images/map-preview.svg" alt="Mostrar mapa de Google" class="w-full h-auto" loading="lazy" decoding="async" />
          <div class="p-4 bg-blackx flex items-center justify-between">
            <span class="text-white/80">Cargar mapa interactivo</span>
            <span class="text-gold group-hover:underline">Abrir</span>
          </div>
        </button>

        <div *ngIf="loaded" class="w-full aspect-[4/3] bg-blackx">
          <iframe
            [src]="embedSafe"
            width="100%" height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Mapa Taquería El Ga’on">
          </iframe>
        </div>
      </div>

      <div class="mt-6">
        <a class="text-vermillion hover:underline" href="https://maps.app.goo.gl/UxpdeZjwFthaKxne7" target="_blank" rel="noopener">Abrir en Google Maps</a>
      </div>
    </div>
  </section>
  `
})
export class UbicacionComponent {
  loaded = false;
  embedSafe!: SafeResourceUrl;

  private readonly embed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d473.0515482394382!2d-97.3976427962211!3d18.464998851814144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c5bd003ebdd59b%3A0xf6cfd9ebb6912537!2zVGFxdWVyaWEg4oCcRWwgR2HigJlPbuKAnQ!5e0!3m2!1sen!2smx!4v1756935813714!5m2!1sen!2smx';

  constructor(private s: DomSanitizer) {}

  loadMap() {
    this.embedSafe = this.s.bypassSecurityTrustResourceUrl(this.embed);
    this.loaded = true;
  }
}
