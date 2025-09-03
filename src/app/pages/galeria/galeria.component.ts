import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Photo = { key: string; alt: string };

@Component({
  standalone: true,
  selector: 'app-galeria',
  imports: [CommonModule],
  template: `
  <section class="bg-blackx text-white">
    <div class="mx-auto max-w-6xl px-4 py-8">
      <h1 class="text-3xl md:text-4xl font-display mb-4">Galería</h1>
      <p class="text-white/70 mb-6">Selección curada de la taquería. Todas las imágenes se cargan de forma progresiva.</p>

      <!-- Masonry using CSS columns -->
      <div class="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:balance]">
        <figure *ngFor="let p of photos; let i = index" class="mb-4 break-inside-avoid">
          <a href="" (click)="open(i); $event.preventDefault()">
            <picture>
              <source [attr.srcset]="srcset(p.key, 'webp')" type="image/webp" />
              <img
                [src]="placeholder(p.key)"
                [attr.srcset]="srcset(p.key, 'jpg')"
                [attr.sizes]="sizes"
                [alt]="p.alt"
                class="w-full rounded-xl shadow-sm hover:opacity-95 transition"
                loading="lazy"
                decoding="async" />
            </picture>
          </a>
        </figure>
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <div *ngIf="isOpen()" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" (click)="close()">
    <button class="absolute top-4 right-4 text-white/80 hover:text-white text-2xl" (click)="close(); $event.stopPropagation()" aria-label="Cerrar">×</button>
    <button class="absolute left-4 text-white/80 hover:text-white text-2xl" (click)="prev(); $event.stopPropagation()" aria-label="Anterior">‹</button>
    <button class="absolute right-10 text-white/80 hover:text-white text-2xl" (click)="next(); $event.stopPropagation()" aria-label="Siguiente">›</button>

    <figure class="max-w-[90vw] max-h-[85vh]" (click)="$event.stopPropagation()">
      <picture>
        <source [attr.srcset]="srcset(currentPhoto().key, 'webp')" type="image/webp" />
        <img
          [src]="best(currentPhoto().key, 'jpg')"
          [attr.srcset]="srcset(currentPhoto().key, 'jpg')"
          [attr.sizes]="'90vw'"
          [alt]="currentPhoto().alt"
          class="w-auto h-auto max-w-full max-h-[85vh] rounded-lg"
          decoding="async" />
      </picture>
      <figcaption class="mt-3 text-center text-white/70 text-sm">{{ currentPhoto().alt }}</figcaption>
    </figure>
  </div>
  `,
})
export class GaleriaComponent {
  // Expected files in public/gallery/: gaon.jpg, gaon2.jpg, ..., gaon10.jpg
  photos: Photo[] = [
    { key: 'gaon', alt: 'Gaonera al carbón' },
    { key: 'gaon2', alt: 'Taco con queso fundido' },
    { key: 'gaon3', alt: 'Plancha con cebollas y chiles' },
    { key: 'gaon4', alt: 'Taco de arrachera' },
    { key: 'gaon5', alt: 'Taco de sirloin' },
    { key: 'gaon6', alt: 'Rib eye en la plancha' },
    { key: 'gaon7', alt: 'Picanha rebanada' },
    { key: 'gaon8', alt: 'Salsa y totopos' },
    { key: 'gaon9', alt: 'Fachada del local' },
    { key: 'gaon10', alt: 'Parrilla en acción' },
  ];

  // Render state
  private openIndex = signal<number | null>(null);
  isOpen = () => this.openIndex() !== null;
  open = (i: number) => this.openIndex.set(i);
  close = () => this.openIndex.set(null);
  next = () => this.openIndex.set(this.openIndex() === null ? 0 : (this.openIndex()! + 1) % this.photos.length);
  prev = () => this.openIndex.set(this.openIndex() === null ? 0 : (this.openIndex()! - 1 + this.photos.length) % this.photos.length);
  currentPhoto = () => this.photos[this.openIndex() ?? 0];

  // Images live under public/gallery; Sharp creates /public/gallery/opt/{w}/<name>.webp|jpg
  readonly widths = [320, 640, 960, 1280];
  readonly sizes = '(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw';

  srcset(name: string, ext: 'webp'|'jpg'): string {
    return this.widths.map(w => `./gallery/opt/${w}/${name}.${ext} ${w}w`).join(', ');
  }
  best(name: string, ext: 'webp'|'jpg'): string {
    return `./gallery/opt/960/${name}.${ext}`;
  }
  placeholder(name: string): string {
    // Use 320 JPG as a tiny fallback; browsers will upgrade via srcset
    return `./gallery/opt/320/${name}.jpg`;
  }

  // Keyboard support for lightbox
  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.isOpen()) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }
}
