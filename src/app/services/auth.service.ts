import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, config, of } from 'rxjs';
import { catchError, mapTo, tap, map } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';

export class Tokens {
  jwt: string;
  refreshToken: string;
}

export interface IUser {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http: HttpClient) { }

  login(user: IUser): Observable<any> {
    return this.http.post<any>(`${env.apiUrl}/login`, user)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          alert(error.error);
          return of(false);
        }));
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${env.apiUrl}/logout`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(error.error);
        return of(false);
      }));
  }

  isLoggedIn(): boolean {
    console.log('onLogin ', !!this.getJwtToken());
    return !!this.getJwtToken();
  }

  refreshToken(): Observable<any> {
    console.log('onRefreshToken ', this.getRefreshToken());
    return this.http.post<any>(`${env.apiUrl}/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.jwt);
    }));
  }

  getJwtToken(): string {
    console.log('onGetJwtToken ', this.JWT_TOKEN);
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, tokens: Tokens): void {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser(): void {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string): void {
    console.log('storeJwtToken ', jwt);
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens): void {
    console.log('storeTokens ', tokens);
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
  public getRandomNumber(): Observable<any> {
    return this.http.get<any>(`${env.apiUrl}/random`)
      .pipe(map(data => data.value));
  }
}
