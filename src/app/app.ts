import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('el-gaon');

  // Expose the current year for footer binding (Angular templates should avoid `new`/side effects)
  public readonly year = new Date().getFullYear();
}
