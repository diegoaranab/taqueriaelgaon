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
      <p class="text-white/70 mb-6">2 Poniente #218, Centro, Tehuacán, Puebla.</p>

      <div class="rounded-xl overflow-hidden border border-white/10">
        <!-- Preview image; clicking loads the iframe -->
        <button
          *ngIf="!loaded"
          type="button"
          (click)="loadMap()"
          class="relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-vermillion"
          aria-label="Mostrar mapa de Google (carga al hacer clic)">
          <img
            src="images/map-preview.svg"
            alt="Vista previa del mapa — haz clic para cargar Google Maps"
            class="w-full h-auto"
            loading="lazy"
            decoding="async" />
          <span class="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-vermillion text-white text-sm shadow">
            Click para mostrar mapa
          </span>
        </button>

        <!-- Lazy Google Maps (only after click) -->
        <iframe
          *ngIf="loaded"
          [src]="embedSafe"
          width="100%"
          height="420"
          style="border:0;"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
          title="Mapa de Taquería El Ga’on">
        </iframe>
      </div>

      <div class="mt-6 text-white/80 text-sm">
        <p>Estacionamiento cercano y servicio para llevar.</p>
      </div>
    </div>
  </section>
  `
})
export class UbicacionComponent {
  loaded = false;
  embedSafe!: SafeResourceUrl;

  // Full embed URL from your earlier message
  private readonly embed = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d473.0515482394382!2d-97.3976427962211!3d18.464998851814144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c5bd003ebdd59b%3A0xf6cfd9ebb6912537!2zVGFxdWVyaWEg4oCcRWwgR2HigJlPbuKAnQ!5e0!3m2!1sen!2smx!4v1756935813714!5m2!1sen!2smx';

  constructor(private s: DomSanitizer) {}

  loadMap() {
    this.embedSafe = this.s.bypassSecurityTrustResourceUrl(this.embed);
    this.loaded = true;
  }
}

