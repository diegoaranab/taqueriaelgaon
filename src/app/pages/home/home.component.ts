import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroVideoComponent } from '../../shared/hero-video/hero-video.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink, HeroVideoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
