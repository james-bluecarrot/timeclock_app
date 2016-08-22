import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Observable } from 'rxjs';

import { Auth, IUser } from '../../services';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  user: Observable<IUser>;
  isLogin: boolean = false;

  constructor(private auth: Auth) {
    this.user = this.auth.getUser();
  }

  get displayName() {
    return this.user.map((user: IUser) => user.displayName);
  }

  googleLogin(credentials) {
    this.auth.loginWithGoogleUsingPlugin().then((res: boolean) => this.isLogin = res);
  }

  logTime() {

  }

}
