import { inject, Injectable, signal } from '@angular/core';
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
export interface PromosData { active: Promo[]; upcoming?: Promo[]; }

export interface Business {
  name: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: { number?: string; prefill?: string };
  hours?: Record<string,string>;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);

  /** Build relative URL so SSR and GH Pages both work. */
  private url(file: string): string {
    // No leading slash. Let <base href="/taqueriaelgaon/"> resolve it on the client.
    return `data/${file}`;
  }

  /** Cached signals for quick access across components */
  businessSignal = signal<Business | null>(null);

  private _menu$?: Observable<MenuData>;
  private _promos$?: Observable<PromosData>;
  private _business$?: Observable<Business>;

  constructor() {
    // Warm business and keep a reactive copy in a signal for footer/CTA
    this.business().subscribe(b => this.businessSignal.set(b));
  }

  menu(): Observable<MenuData> {
    this._menu$ ??= this.http.get<MenuData>(this.url('menu.json')).pipe(
      catchError(() => of({ categories: [] })),
      shareReplay(1)
    );
    return this._menu$;
  }

  promos(): Observable<PromosData> {
    this._promos$ ??= this.http.get<PromosData>(this.url('promos.json')).pipe(
      catchError(() => of({ active: [], upcoming: [] })),
      shareReplay(1)
    );
    return this._promos$;
  }

  business(): Observable<Business> {
    this._business$ ??= this.http.get<Business>(this.url('business.json')).pipe(
      catchError(() => of({ name: 'Taquería El Ga’on' } as Business)),
      shareReplay(1)
    );
    return this._business$;
  }

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
