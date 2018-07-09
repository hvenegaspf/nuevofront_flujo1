import { Component, OnInit } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: 'app-preguntasfrecuentes',
  templateUrl: './preguntasfrecuentes.component.html',
  styleUrls: ['./preguntasfrecuentes.component.css']
})
export class PreguntasfrecuentesComponent implements OnInit {
	constructor(meta: Meta, title: Title) {
  		title.setTitle('Preguntas frecuentes - Seguro por kilometro');
  		meta.addTags([
			{ name: 'author',   content: 'Seguro por kilometro - sxkm.mx seguro.sxkm-mx'},
		  	{ name: 'keywords', content: 'seguro de auto, sxkm, seguro por kilometro, seguro de auto por kilómetro, seguro de auto por kilometro, seguro de auto, cotiza seguro de auto por kilometro, cotizar seguro de auto, seguros de autos por kilometros, aig, seguros aig, seguros de auto aig, cotizar seguros de autos por kilometros, seguro de auto cdmx, seguro de auto en mexico, kilometro, seguros de autos, aig sxkm, seguro de auto economico'},
		  	{ name: 'description', content: 'Seguro de auto por kilometro - Preguntas frecuentes - Ingresa tus datos y los de tu auto y de inmediato descubre lo mucho que ahorrarás. Todas nuestras cotizaciones son válidas por 4 días hábiles a partir de la solicitud.' }
		]);
	} 
	ngOnInit() {}

}