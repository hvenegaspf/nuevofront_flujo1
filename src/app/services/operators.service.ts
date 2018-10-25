import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Login } from '../constants/login';
import { Seller } from '../constants/seller';
import { dashCaseToCamelCase } from '@angular/animations/browser/src/util';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};
@Injectable({
  providedIn: 'root'
})
export class OperatorsService {
	url = 'http://dev2.sxkm.mx/api/v3/';
	constructor(private http: HttpClient) { }

	getQuotes(quote_info){
		console.log(quote_info)
		let url = this.url+"quotes?page="+quote_info.page;
		if(quote_info.term!="")
			url = this.url+"quotes/search?term="+quote_info.term+"&page="+quote_info.page;

		if(quote_info.seller_id)
			url+="&seller_id="+quote_info.seller_id;
		if(quote_info.quote_state)
			url +="&quote_state="+quote_info.quote_state;
		if(quote_info.payment_state)
			url += "&payment_state="+quote_info.payment_state;
		if(quote_info.seller_state)
			url += "&seller_state="+quote_info.seller_state;
	
		console.log(url)
		return this.http.get(url, httpOptions)
		    .pipe(
		      tap((data:any) => this.log('getQuotes')),
		      catchError(this.handleError('error getQuotes', []))
		    );
	}
	getSellers(): Observable<Seller[]> {
		return this.http.get<Seller[]>(this.url+"sellers", httpOptions)
		    .pipe(
		      tap(sellers => this.log('fetched sellers')),
		      catchError(this.handleError('error getSellers', []))
		    );
	}
	getFilters(){
		return this.http.get(this.url+"quotes/filters",httpOptions)
		    .pipe(
		      tap(data => this.log('getFilters')),
		      catchError(this.handleError('error getFilters', []))
		    );
	}
	sendEmailQuotes(quote_id){
		let post = {
			quote_id: quote_id
		}
		return this.http.post(this.url+"quotes/send_email", post,httpOptions)
		    .pipe(
		      tap(data => this.log('sendEmailQuotes')),
		      catchError(this.handleError('error sendEmailQuotes', []))
		    );
	}

	updateSellerQuotation(quote_id,seller_id){
		let data = {
			quote_id: quote_id,
			seller_id: seller_id
		}
		return this.http.post(this.url+"quotes/assign_seller",data,httpOptions)
		    .pipe(
		      tap(data => this.log('updateSellerQuotation')),
		      catchError(this.handleError('error updateSellerQuotation', []))
		    );
	}
	deleteQuote(quote_id){
		let data = {
			quote_id: quote_id
		}
		return this.http.post(this.url+"quotes/cancel",data,httpOptions)
		    .pipe(
		      tap(data => this.log('deleteQuote')),
		      catchError(this.handleError('error deleteQuote', []))
		    );
	}

		
	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			// TODO: send the error to remote logging infrastructure
		    console.error(error); // log to console instead
		 
		    // TODO: better job of transforming error for user consumption
		    this.log(`${operation} failed: ${error.message}`);
		 
		    // Let the app keep running by returning an empty result.
		    return of(result as T);
		};
	}

	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	    console.log(message)
	}
}
