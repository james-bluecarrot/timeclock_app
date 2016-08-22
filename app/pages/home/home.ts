import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

import { Observable, BehaviorSubject } from 'rxjs';

import { Auth, IUser, Data, Loader } from '../../services';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  user: BehaviorSubject<IUser>;
  isLogin: boolean = false;

  constructor(private auth: Auth, private data: Data, private loader: Loader) {
    this.user = this.auth.getUser();
  }

  get displayName() {
    return this.user.map((user: IUser) => user.displayName);
  }

  googleLogin(credentials) {
    this.loader.toggleLoader();
    this.auth.loginWithGoogleUsingPlugin().then((res: boolean) => {
      this.isLogin = res;
      this.loader.toggleLoader();
    });
  }

  logTime() {
    this.loader.toggleLoader();
    this.data.logTime(this.user.getValue()).then(res => {
      this.loader.toggleLoader();
    });
  }

}
