
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
isLoggedIn: boolean = false;
  userName: string = '';

  constructor(public _AuthService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this._AuthService.userData.subscribe((decoded) => {
      if (decoded) {
        this.isLoggedIn = true;
        this.userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || ''; // تأكد إن اسم المستخدم موجود
      } else {
        this.isLoggedIn = false;
        this.userName = '';
      }
    });
  }

  logout(): void {
    this._AuthService.logOut();
  }
}
