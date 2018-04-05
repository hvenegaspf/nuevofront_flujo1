import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { ProcesopagoComponent } from './procesopago/procesopago.component';
import { FichapagoComponent } from './fichapago/fichapago.component';

const routes: Routes = [
	//Homepage
	{ path: '', component: HomepageComponent },
	//Cotizador
	{
		path: 'cotizar-seguro-auto-por-kilometro',
		component: CotizadorComponent,
		data: { title: 'Heroes List'}
	},
	//Cotizaciones
	{
		path: 'cotizaciones/:tipo',
		component: CotizacionesComponent ,
		data: {
			title: "Cotizaciones flujo A"
		}
	},
	{ path: 'cotizacion/:id',      component: CotizacionesComponent },

	//Carrito de compras
	{
		path: 'comprar/:token',
		component: ProcesopagoComponent ,
		data: {}
	},
	//Pantalla de compra - Ficha de pago
	{
		path: 'pago-exitoso/:id',
		component: FichapagoComponent ,
		data: {}
	},
	

	{
		path: 'error',
		redirectTo: '/heroes',
		pathMatch: 'full'
	},
	//Default
	{ path: '**', component: HomepageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
    // other imports here
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
