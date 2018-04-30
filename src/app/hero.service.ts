import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators'

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable()
export class HeroService {
	private heroUrl = 'api/heroes'

	constructor(
		private messageService: MessageService,
		private http: HttpClient
	) { }
	
	getHeroes(): Observable <Hero[]> {
		return this.http.get<Hero[]>(this.heroUrl)
			.pipe(
				tap(heroes => this.log(`fetched heroes`)),
				catchError(this.handleError('gerHeroes', [])
			)
		)
	}

	getHero(id: number): Observable<Hero> {
		const url = `${this.heroUrl}/${id}`
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		)
	}

	private log(message: string): void {
		this.messageService.add('HeroService:' + message)
	}

	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} failed: ${error.message}`)
			return of(result as T)
		}
	}

	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroUrl, hero, httpOptions).pipe(
			tap(_ => this.log(`Updateed hero id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		)
	}

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroUrl, hero, httpOptions).pipe(
			tap((hero: Hero) => this.log(`added hero w/ id = ${hero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		)
	}

	deleteHero(hero: Hero | number): Observable<Hero> {
		const id = typeof hero === 'number' ? hero : hero.id
		const url = `${this.heroUrl}/${id}`
		return this.http.delete<Hero>(url, httpOptions).pipe(
			tap(_ => this.log(`deleted hero id=${id}`)),
    		catchError(this.handleError<Hero>('deleteHero'))
		)
	}

	searchHeroes(term: string): Observable<Hero[]> {
		if (!term.trim()) {
			return of ([])
		}
		return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
			tap(_ => this.log(`found heroes matching "${term}"`)),
			catchError(this.handleError<Hero[]>('searchHeroes', []))
		)
	}
}
