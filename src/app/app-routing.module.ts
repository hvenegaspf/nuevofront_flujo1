import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { ProcesopagoComponent } from './procesopago/procesopago.component';
import { FichapagoComponent } from './fichapago/fichapago.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { AcercaComponent } from './acerca/acerca.component';
import { AvisoComponent } from './aviso/aviso.component';
import { TerminosComponent } from './terminos/terminos.component';

const routes: Routes = [
	//Homepage
	{ path: '', component: HomepageComponent },
	
	//Cotizador
	{
		path: 'v2-cotizar-seguro-auto-por-kilometro',
		component: CotizadorComponent,
		data: { title: 'Heroes List'}
	},
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
	//Pantalla de compra - Ficha de pago con tarjeta d
	{
		path: ':url/:id_quote/:id/ficha',
		component: FichapagoComponent ,
		data: {
			quote_id: 250
		}
	},
	//Pantalla de centro de ayuda
	{
		path: 'preguntas-frecuentes',
		component: AyudaComponent ,
		data: {}
	},
	//Pantalla de Acerca De
	{
		path: 'acerca-de',
		component: AcercaComponent ,
		data: {}
	},
	//Aviso de privacidad
	{
		path: 'aviso-de-privacidad',
		component: AvisoComponent ,
		data: {}
	},
	//Términos y condiciones
	{
		path: 'terminos-y-condiciones',
		component: TerminosComponent ,
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
