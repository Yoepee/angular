import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';

import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  getHeroes(): Observable<Hero[]> {
    // const heroes = of(HEROES);
    // this.messageService.add("HeroService: fetched heroes")
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_=> this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
  }
  getHero(id: number): Observable<Hero> {
    // const hero = HEROES.find(h => h.id === id)!;
    // this.messageService.add("HeroService: fetched heroes")
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
    .pipe(
      tap(_=> this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id = ${id}`))
    )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
    .pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to ther server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
    .pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>(`addHero`))
      );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_=> this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x=>x.length?
        this.log(`found heroes matching "${term}"`)
        : this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }

  httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // getHeroes():Hero[]{
  //   return HEROES;
  // }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
 * HTTP 요청이 실패한 경우를 처리합니다.
 * 애플리케이션 로직 흐름은 그대로 유지됩니다.
 *
 * @param operation - 실패한 동작의 이름
 * @param result - 기본값으로 반환할 객체
 */
  private handleError<T>(operation = 'operation', result?: T){
    return (error:any) : Observable<T> => {
      // TODO: 리모트 서버로 에러 메시지 보내기
      console.error(error); // 지금 콘솔에 로그를 출력

      // TODO: 사용자가 이해할 수 있는 형태로 변환하기
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T)
    }
  }
  

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
}
