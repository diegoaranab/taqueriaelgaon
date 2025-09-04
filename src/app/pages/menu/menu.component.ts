import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../core/seo.service';
import { MenuTabsComponent } from '../../components/menu-tabs/menu-tabs.component';
import { BusinessCtaComponent } from '../../components/business-cta/business-cta.component';

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [CommonModule, MenuTabsComponent, BusinessCtaComponent],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    const title = 'Menú — Taquería El Ga’on';
    const description = 'Tacos, quesadillas y más. Consulta precios y especialidades de la casa.';
    this.seo.setTags({ title, description });

    // Minimal Menu JSON-LD example (extend as needed)
    this.seo.setJsonLd('ld-menu', {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      'name': 'Menú Taquería El Ga’on',
      'hasMenuSection': [
        { '@type': 'MenuSection', 'name': 'Tacos', 'offers': { '@type': 'Offer', 'priceCurrency': 'MXN' } },
        { '@type': 'MenuSection', 'name': 'Quesadillas', 'offers': { '@type': 'Offer', 'priceCurrency': 'MXN' } }
      ]
    });
  }
}
