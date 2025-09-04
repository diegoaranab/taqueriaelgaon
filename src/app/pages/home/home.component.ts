import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { HeroVideoComponent } from '../../shared/hero-video/hero-video.component';
import { PromoTickerComponent } from '../../components/promo-ticker/promo-ticker.component';
import { BusinessCtaComponent } from '../../components/business-cta/business-cta.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink, HeroVideoComponent, PromoTickerComponent, BusinessCtaComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    const title = 'Taquería El Ga’on — Gaonera al momento en Tehuacán';
    const description = 'Tacos de gaonera, pastor y más. 2 Poniente #218, Tehuacán, Puebla. Abierto tarde, para llevar y en sitio.';
    this.seo.setTags({ title, description });

    // Restaurant + LocalBusiness
    this.seo.setJsonLd('ld-restaurant', {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      'name': 'Taquería El Ga’on',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '2 Poniente #218',
        'addressLocality': 'Tehuacán',
        'addressRegion': 'Puebla',
        'addressCountry': 'MX'
      },
      'servesCuisine': 'Mexican',
      'priceRange': '$'
    });

    this.seo.setJsonLd('ld-local', {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Taquería El Ga’on',
      'image': ['assets/gallery/gaon.jpg'],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '2 Poniente #218',
        'addressLocality': 'Tehuacán',
        'addressRegion': 'Puebla',
        'addressCountry': 'MX'
      },
      'telephone': '+52-238-000-0000'
    });
  }
}
