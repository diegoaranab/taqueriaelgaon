import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroVideoComponent } from '../../shared/hero-video/hero-video.component';
import { PromoTickerComponent } from '../../shared/promo-ticker/promo-ticker.component';
import { BusinessCtaComponent } from '../../shared/business-cta/business-cta.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, HeroVideoComponent, PromoTickerComponent, BusinessCtaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
