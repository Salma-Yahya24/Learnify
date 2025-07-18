import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

import { LoginRequest, LoginSuccessResponse } from '../../interfaces/login';
import { DecodedToken } from '../../interfaces/decoded-token';
import { enviroment } from '../../../enviroment/enviroment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userData: BehaviorSubject<null | DecodedToken> = new BehaviorSubject<null | DecodedToken>(null);

  constructor(
    private _HttpClient: HttpClient,
    private _Router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.decodeUserData();
    }
  }

  decodeUserData() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.logOut();
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const expDate = decoded.exp ? decoded.exp * 1000 : 0;

      if (expDate && Date.now() > expDate) {
        this.logOut();
      } else {
        this.userData.next(decoded);
      }
    } catch (error) {
      console.error('Invalid token', error);
      this.logOut();
    }
  }

  login(data: LoginRequest): Observable<LoginSuccessResponse> {
    return this._HttpClient.post<LoginSuccessResponse>(
      `${enviroment.baseUrl}/api/auth/login`,
      data
    ).pipe(
      tap((response) => {
        if (response.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          const decoded = jwtDecode<DecodedToken>(response.token);
          this.userData.next(decoded);

          this._Router.navigate(['/home']);
        }
      }),
      catchError((error) => {
        console.error('Login error', error);
        throw error;
      })
    );
  }

  logOut() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.userData.next(null);
    this._Router.navigate(['login']);
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }
}
