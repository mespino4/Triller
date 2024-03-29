import { Component, inject } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { User } from '../../_models/user';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { DatePickerComponent } from '../../_forms/date-picker/date-picker.component';
import { MatNativeDateModule } from '@angular/material/core';
import { AccountService } from '../../shared/services.index';
import { AbstractControl, FormBuilder, FormGroup, 
          FormsModule, ReactiveFormsModule, ValidatorFn,
          Validators } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, FormsModule,  RouterModule, ReactiveFormsModule, 
    TextInputComponent, DatePickerComponent, MatNativeDateModule, ToastrModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})

export class AuthenticationComponent {
  isLogin: boolean = true
  model: any = {}; // An object to store form input data.
  currentUser$: Observable<User | null> = of(null); // An observable to store the current user.

  private toastr = inject(ToastrService)
  private router = inject(Router)
  private accountService = inject(AccountService)
  private fb = inject(FormBuilder)

  ngOnInit(): void {
    this.accountService.logout();
    this.currentUser$ = this.accountService.currentUser$;
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/home');
        this.model = {};
      },
    });
  }

  registerPage() {
    this.isLogin = false
  }
  loginPage() {
    this.isLogin = true
  }

  //register
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  initializeForm(){
    this.registerForm = this.fb.group({
      language: ['en'],
      username: ['', Validators.required],
      displayname: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      location: ['', Validators.required],
      password: ['', [Validators.required, 
        Validators.minLength(4), Validators.maxLength(16)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }

  register() {
    const dob = this.GetDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = { ...this.registerForm.value, dateOfBirth: this.GetDateOnly(dob) };
    this.accountService.register(values).subscribe({
      next: (user) => {this.router.navigateByUrl('/home');},
      error: (error) => {
        this.validationErrors = error;
        this.toastr.error = error
      },
      complete: () => {},
    });
  }

  private GetDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset()))
      .toISOString().slice(0,10);
  }
}
