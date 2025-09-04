import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private renderer: Renderer2;
  constructor(
    private titleSrv: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setTags(opts: { title?: string; description?: string; image?: string; url?: string }) {
    if (opts.title) this.titleSrv.setTitle(opts.title);
    if (opts.description) {
      this.meta.updateTag({ name: 'description', content: opts.description });
      this.meta.updateTag({ property: 'og:description', content: opts.description });
    }
    if (opts.title) {
      this.meta.updateTag({ property: 'og:title', content: opts.title });
      this.meta.updateTag({ name: 'twitter:title', content: opts.title });
    }
    if (opts.image) {
      this.meta.updateTag({ property: 'og:image', content: opts.image });
      this.meta.updateTag({ name: 'twitter:image', content: opts.image });
    }
    if (opts.url) {
      this.meta.updateTag({ property: 'og:url', content: opts.url });
      this.meta.updateTag({ name: 'twitter:url', content: opts.url });
    }
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  /** Replace existing JSON-LD block with same id, then append new one. */
  setJsonLd(id: string, data: object) {
    const existing = this.doc.getElementById(id);
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(data);
    this.renderer.appendChild(this.doc.head, script);
  }
}
