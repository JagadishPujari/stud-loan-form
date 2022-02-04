import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators, FormBuilder } from '@angular/forms';
import { RecaptchaLoaderService } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { RecaptchaModule } from 'ng-recaptcha';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  token: string|undefined;

  constructor(private cd: ChangeDetectorRef, 
    private fb: FormBuilder, 
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private Recaptcha : RecaptchaLoaderService
    ) {
      this.token = undefined;
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phone: [null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      amount: [null, [Validators.required, Validators.pattern(/^\d{4,100}$/)]],
      recaptcha :[Validators.required]
    });
  }
  public resolved(captchaResponse: string): void {
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.token = captchaResponse;
  }
  registerStudent() {
    console.log("Form data", this.form.value);
    const headers = { 'Authorization': 'Bearer my-token', 'My-Custom-Header': 'foobar' };
    const body = this.form.value;
    this.httpClient.post<any>('https://qa.training.com/D365TestAPI/api/SaveCustomerDetails', body, { headers }).subscribe(data => {
        this.toastr.success('Your application submitted successfully, We will get back to you soon', 'Success');
        this.form.reset();
    }, error => {
      this.toastr.error('Something went wrong', 'Failed');
      this.form.reset();
    })
  }
  
}