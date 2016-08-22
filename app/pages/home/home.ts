import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Observable } from 'rxjs';
import { AngularFire } from 'angularfire2';

import { Auth, IUser } from '../../services/auth';

@Component({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {

  user: Observable<IUser>;
  isLogin: boolean = false;

  constructor(private af: AngularFire, private auth: Auth) {
    this.user = this.auth.getUser();
  }

  googleLogin(credentials) {
    console.log('test')
    this.auth.loginWithGoogleUsingWeb().then((res: boolean) => this.isLogin = res);
  }

}
