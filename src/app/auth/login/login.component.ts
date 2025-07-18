import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginSuccessResponse } from '../../shared/interfaces/login';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
  });

  isSuccessResponse(
    res: LoginSuccessResponse 
  ): res is LoginSuccessResponse {
    return 'token' in res;
  }

  submitloginForm() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this._AuthService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (this.isSuccessResponse(res)) {
          localStorage.setItem('token', res.token);
          this._AuthService.decodeUserData();
          this._Router.navigate(['home']);
        } else {
          this.errorMessage =  'Login failed';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = typeof err.error === 'string' ? err.error : 'Login failed';
        this.isLoading = false;
      },
    });
  }
}
