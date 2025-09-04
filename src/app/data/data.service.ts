import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, shareReplay } from 'rxjs';

export interface TacoItem { name: string; prices: { maiz: number; harina: number; con: number }; }
export interface SimpleItem { name: string; price: number; desc?: string; }
export interface Category {
  id: 'tacos' | 'combos' | 'bebidas' | 'postres' | (string & {});
  label: string;
  items: (TacoItem | SimpleItem)[];
  notes?: string;
}
export interface MenuData { categories: Category[]; }

export interface Promo {
  title: string;
  body?: string;
  start?: string;
  end?: string;
  cta?: string;
  href?: string;
}
export interface PromosData {
  active: Promo[];
  upcoming: Promo[];
}

export interface Business {
  name: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: { number?: string; prefill?: string };
  hours?: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /** Build relative URL so SSR and GH Pages both work (no leading slash). */
  private url(file: 'menu.json' | 'promos.json' | 'business.json'): string {
    return `data/${file}`;
  }

  menu(): Observable<MenuData> {
    if (!this.isBrowser) return of({ categories: [] });
    return this.http.get<MenuData>(this.url('menu.json')).pipe(
      catchError(() => of({ categories: [] })),
      shareReplay(1)
    );
  }

  promos(): Observable<PromosData> {
    if (!this.isBrowser) return of({ active: [], upcoming: [] });
    return this.http.get<PromosData>(this.url('promos.json')).pipe(
      catchError(() => of({ active: [], upcoming: [] })),
      shareReplay(1)
    );
  }

  private readonly fallbackBusiness: Business = {
    name: 'Taquería El Ga’on',
    address: 'Tehuacán, Puebla',
    hours: {
      monday: '6pm – 1am',
      tuesday: '6pm – 1am',
      wednesday: '6pm – 1am',
      thursday: '6pm – 1am',
      friday: '6pm – 1am',
      saturday: '6pm – 1am',
      sunday: '6pm – 1am',
    },
  };

  private business$ = (this.isBrowser
    ? this.http.get<Business>(this.url('business.json'))
    : of(this.fallbackBusiness)
  ).pipe(
    catchError(() => of(this.fallbackBusiness)),
    shareReplay(1)
  );

  /** Writable signal for convenient template access. */
  readonly businessSignal = signal<Business | null>(null);

  constructor() {
    if (this.isBrowser) {
      this.business$.subscribe((b) => this.businessSignal.set(b));
    } else {
      this.businessSignal.set(this.fallbackBusiness);
    }
  }
}
