import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuotationService } from '../../services/quotation.service';
import { CartService } from '../../services/cart.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { Maker } from '../../constants/maker';
import { Year } from '../../constants/year';
import { Model } from '../../constants/model';
import { Version } from '../../constants/version';
import { Quotation } from '../../constants/quotation';
import { Policy } from '../../constants/policy';
import { Aig } from '../../constants/aig';
import { Store } from '../../constants/store';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
	quote_id:any;
	transaction_id:any;
	package_id:any;
	pago:any;
	store:any="";
	quotation =  new Quotation('','','','','','','','','',2,'','','','');
	transaction:any;

	constructor(@Inject(PLATFORM_ID) private platformId: Object,private route: ActivatedRoute, private location: Location, private router: Router, private quotationService: QuotationService, private cartService: CartService) { }
	ngOnInit() {
		this.quote_id = this.route.snapshot.params['quote_id'];
		this.transaction_id = this.route.snapshot.params['transaction_id'];
		this.pago = this.route.snapshot.params['metodo'];
		this.store = this.route.snapshot.params['store'];
		console.log("Tienda"+this.store);
		this.getTicket();
		//this.getQuotation();
	}

	getQuotation(){
		this.quotationService.getQuotation(this.quote_id)
	    	.subscribe((data:any) => {
	    		this.quotation	= data.quote;
	    		console.log(this.quotation)
	    	});
	}
	
	getTicket(){
		this.cartService.getTicket(this.transaction_id)
			.subscribe((transaction:any) => {
				this.transaction = transaction;
				console.log(transaction);
			})
	}

}
