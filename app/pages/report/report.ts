import { Component } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { App, NavController } from 'ionic-angular';

import { Auth, IUser, Data, Loader } from '../../services';

@Component({
  templateUrl: 'build/pages/report/report.html'
})
export class ReportPage {

  api: string = 'https://47urkiq82k.execute-api.us-east-1.amazonaws.com/dev/sendreport';

  constructor(private http: Http, private loader: Loader) {

  }

  GetHeaders() {
    let headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options: RequestOptions = new RequestOptions();
    options.headers = headers;
    return options;
  }

  sendEmail(email: string, startDate: HTMLElement, endDate: HTMLElement, resEl: HTMLElement) {
    console.log(email, startDate, endDate);
    this.loader.toggleLoader();
    this.http.post(this.api, { email: email, startDate: startDate['_text'], endDate: endDate['_text'] }, this.GetHeaders()).subscribe(res => {
      resEl.innerHTML = res.json();
      this.loader.toggleLoader();
    });
  }

}
