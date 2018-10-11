import { Injectable } from '@angular/core';
import { throwError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Login } from '../constants/login';
import { dashCaseToCamelCase } from '@angular/animations/browser/src/util';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {
	url = 'http://dev2.sxkm.mx';
	constructor(private http: HttpClient) { }

	login(datos){
		return this.http.post(this.url+'/users/sign_in.json',datos,httpOptions)
			.pipe(map((user: any) => {
					return user;
			}),(catchError(this.errorHandler)));
	}

	errorHandler(error: HttpErrorResponse){
    console.log(error);
    if (error.status == 401) {
			//console.log(error.error)
      return throwError("Correo o contraseña inválidos.");
    }
	}
	
	logout(){
		return this.http.delete(this.url+'/users/sign_out.json',httpOptions)
	}

	// /** POST: add a new hero to the server */
	// sendLogin (login: Login): Observable<Login> {
	//     return this.http.post<Login>(this.url+"", login, httpOptions).pipe(
	//       tap((login: Login) => this.log('post')),
	//       catchError(this.handleError<Login>('add quotation'))
	//     );
	// }

	// private handleError<T> (operation = 'operation', result?: T) {
	// 	return (error: any): Observable<T> => {
	// 		// TODO: send the error to remote logging infrastructure
	// 	    console.error(error); // log to console instead
		 
	// 	    // TODO: better job of transforming error for user consumption
	// 	    this.log(`${operation} failed: ${error.message}`);
		 
	// 	    // Let the app keep running by returning an empty result.
	// 	    return of(result as T);
	// 	};
	// }
	// /** Log a HeroService message with the MessageService */
	// private log(message: string) {
	//     console.log(message)
	// }
}
