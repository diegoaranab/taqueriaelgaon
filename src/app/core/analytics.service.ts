import { Injectable } from '@angular/core';

declare global {
  interface Window { dataLayer: any[]; gtag: (...args: any[]) => void; }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private gaLoaded = false;
  private readonly key = 'ga_consent_accepted';
  private readonly measurementId = 'G-XXXXXXXXXX'; // TODO: replace with real GA4 ID

  hasConsent(): boolean {
    try { return localStorage.getItem(this.key) === '1'; } catch { return false; }
  }

  giveConsent() {
    try { localStorage.setItem(this.key, '1'); } catch {}
    this.loadGA();
  }

  revokeConsent() {
    try { localStorage.removeItem(this.key); } catch {}
    // Note: not removing scripts live; page reload will remove GA.
  }

  maybeInit() {
    if (this.hasConsent()) this.loadGA();
  }

  private loadGA() {
    if (this.gaLoaded) return;
    this.gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); } as any;

    // Config bootstrap
    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, { anonymize_ip: true });

    // Inject GA script (deferred)
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    s.setAttribute('data-cookieconsent', 'ignore');
    document.head.appendChild(s);
  }

  trackEvent(name: string, params: Record<string, any> = {}) {
    if (!this.gaLoaded) return;
    window.gtag('event', name, params);
  }
}
