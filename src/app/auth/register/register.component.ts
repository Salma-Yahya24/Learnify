import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterResponse } from '../../shared/interfaces/register';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  isLoading: boolean = false;
  errorMessage: string = '';
  profileImage: File | null = null;
  constructor(private _AuthService: AuthService, private _Router: Router) {}

  registerForm: FormGroup = new FormGroup({
    userName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
    telephoneNumber: new FormControl(null),
    dateOfBirth: new FormControl(null),
    genderName: new FormControl(null, Validators.required),
    roleName: new FormControl(null, Validators.required),
    profileImage: new FormControl(null),
  });
    onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileImage = input.files[0];
    }
  }
  submitRegisterForm(){
    if(this.registerForm.invalid){
      return
    }
    this.isLoading = true
    this.errorMessage = ''
    const formData = {
      ...this.registerForm.value,
      profileImage: this.profileImage
    }
    this._AuthService.register(formData).subscribe({
      next: (res:RegisterResponse) => {
        this._Router.navigate(['/login']);
        this.isLoading = false
      },
      error: (err) =>{
        this.errorMessage = err.error.message;
        this.isLoading = false
      }
    })
  }
}
