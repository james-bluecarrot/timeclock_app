import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFire } from 'angularfire2';

import { Auth } from '../../services/auth';

@Component({
  templateUrl: 'build/pages/home/home.html',
})
export class HomePage {

  user: { displayName: string, uid: string };

  constructor(private af: AngularFire, private auth: Auth) {
    this.user = this.auth.user;
  }

  googleLogin(credentials) {
    this.auth.loginWithGoogleUsingPlugin().subscribe(user => {
      console.log(user);
      this.user.displayName = user.auth.displayName;
      this.user.uid = user.auth.uid;
      window.localStorage.setItem('user', JSON.stringify(this.auth.user));
    });
  }

  googleLogin2(credentials) {
    this.auth.loginWithGoogleUsingWeb().subscribe(user => {
      console.log(user);
      this.user.displayName = user.auth.displayName;
      this.user.uid = user.auth.uid;
      window.localStorage.setItem('user', JSON.stringify(this.auth.user));
    });
  }

}
