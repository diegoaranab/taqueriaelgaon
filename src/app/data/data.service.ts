import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
  whatsapp?: { number?: string; prefill?: string };
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private base = '/data'; // served from /public/data

  menu(): Observable<MenuData> {
    return this.http.get<MenuData>(`${this.base}/menu.json`);
  }
  promos(): Observable<PromosData> {
    return this.http.get<PromosData>(`${this.base}/promos.json`);
  }
  business(): Observable<Business> {
    return this.http.get<Business>(`${this.base}/business.json`);
  }

  whatsappUrl(message: string, biz?: Business): string {
    const num = biz?.whatsapp?.number?.replace(/[^\d]/g, '') ?? '';
    const base = num ? `https://wa.me/${num}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(message)}`;
  }
}
