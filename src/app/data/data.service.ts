import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { Observable, of, catchError } from 'rxjs';

export interface TacoItem { name: string; prices: { maiz: number; harina: number; con: number }; }
export interface SimpleItem { name: string; price: number; }
export interface Category {
  id: 'tacos' | 'bebidas' | 'postres' | (string & {});
  label: string;
  items: (TacoItem | SimpleItem)[];
  notes?: string;
}
export interface MenuData { categories: Category[]; }

export interface Promo { title: string; body?: string; start?: string; end?: string; cta?: string; href?: string; }
export interface PromosData { active: Promo[]; upcoming?: Promo[]; }

export interface Business {
  name: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  whatsapp?: { number?: string; prefill?: string };
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  public businessSignal = signal<Business | null>(null);
  private readonly baseHref: string = (inject(APP_BASE_HREF, { optional: true }) ?? '/').toString();

  constructor() {
    this.business().subscribe(b => this.businessSignal.set(b));
  }

  /**
   * Build a URL under the app's <base href>, e.g. '/taqueriaelgaon/data/...'
   * Works in browser and during Angular prerender.
   */
  private url(file: string): string {
    // SSR-safe: rely on Angular’s APP_BASE_HREF (set by baseHref in angular.json)
    const ensureSlashEnd = (s: string) => s.endsWith('/') ? s : (s + '/');
    return ensureSlashEnd(this.baseHref) + 'data/' + file;
  }

  menu(): Observable<MenuData> {
    return this.http.get<MenuData>(this.url('menu.json')).pipe(
      catchError(() => of({ categories: [] }))
    );
  }

  promos(): Observable<PromosData> {
    return this.http.get<PromosData>(this.url('promos.json')).pipe(
      catchError(() => of({ active: [] }))
    );
  }

  business(): Observable<Business> {
    return this.http.get<Business>(this.url('business.json')).pipe(
      catchError(() => of({ name: 'Taquería El Ga’on' } as Business))
    );
  }

  whatsappUrl(message: string, biz?: Business): string {
    const num = biz?.whatsapp?.number?.replace(/[^\d]/g, '') ?? '';
    const base = num ? `https://wa.me/${num}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(message)}`;
  }
}
