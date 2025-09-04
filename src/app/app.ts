import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ConsentBannerComponent } from './components/consent-banner/consent-banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ConsentBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('el-gaon');

  // Expose the current year for footer binding (Angular templates should avoid `new`/side effects)
  public readonly year = new Date().getFullYear();
}
