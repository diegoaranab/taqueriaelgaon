import { Component } from '@angular/core';
import { MenuTabsComponent } from '../../components/menu-tabs/menu-tabs.component';
import { BusinessCtaComponent } from '../../shared/business-cta/business-cta.component';

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [MenuTabsComponent, BusinessCtaComponent],
  template: `
    <app-menu-tabs></app-menu-tabs>
    <app-business-cta></app-business-cta>
  `
})
export class MenuComponent {}
