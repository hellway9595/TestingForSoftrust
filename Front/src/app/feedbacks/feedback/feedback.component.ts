import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/shared/feedback.service';
import { NgForm, FormGroupName } from '@angular/forms';
import { LastMessage } from 'src/app/shared/feedback.model';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styles: []
})
export class FeedbackComponent implements OnInit {
  formMessage: LastMessage;

  constructor(public service: FeedbackService) {
    window['verifyCallback'] = this.verifyCallback.bind(this);
  }

  private captchaPassed = false;
  public showBlock = true;
  public showRegBlock: string;
  public showAfterBlock: string;

  displayRecaptcha() {
    var doc = <HTMLDivElement>document.getElementById('signup-form');
    var script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    doc.appendChild(script);
  }

  verifyCallback(response) {
    //alert(response);
    this.captchaPassed = true;
  }

  ngOnInit(): void {
    this.nullForm2();
    this.resetForm();
    this.captchaPassed = false;
    this.showBlock = true;
  }

  public myModel = ''
  public mask = ['+', '7', ' ', '(', /[0-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]


  nullForm2() {
    this.service.formMessage = {
      ID: 0,
      MessageText: '',
      IdC: 0,
      IdT: 0
    }
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();
    this.service.formData = {
      ID: 0,
      Surname: '',
      Mail: '',
      PhoneNumber: '',
      Theme: '',
      Message: ''
    }
  }
  onSubmit(form: NgForm) {
    if (this.captchaPassed) {
      this.service.postFeedback(form.value).subscribe(
        res => {
          this.resetForm(form);

          this.service.getData().subscribe((data: LastMessage) => this.formMessage = data);
        },
        err => {
          console.log(err);
        }
      )
      this.showBlock = false;
    } else {
      alert("Вы не прошли капчу!");
    }
  }
}
