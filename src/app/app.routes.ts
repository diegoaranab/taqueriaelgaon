import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { PromocionesComponent } from './pages/promociones/promociones.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { UbicacionComponent } from './pages/ubicacion/ubicacion.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Taquería El Ga’on · #TacosDeAdeveras' },
  { path: 'menu', component: MenuComponent, title: 'Menú · Taquería El Ga’on' },
  { path: 'promociones', component: PromocionesComponent, title: 'Promociones · Taquería El Ga’on' },
  { path: 'galeria', component: GaleriaComponent, title: 'Galería · Taquería El Ga’on' },
  { path: 'nosotros', component: NosotrosComponent, title: 'Nosotros · Taquería El Ga’on' },
  { path: 'ubicacion', component: UbicacionComponent, title: 'Ubicación · Taquería El Ga’on' },
  { path: 'contacto', component: ContactoComponent, title: 'Contacto · Taquería El Ga’on' },
  { path: '**', redirectTo: '' }
];
