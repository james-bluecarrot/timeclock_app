import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import {
  FIREBASE_PROVIDERS, defaultFirebase,
  AngularFire, firebaseAuthConfig, AuthProviders,
  AuthMethods
} from 'angularfire2';

import { HomePage } from './pages/home/home';
import { Auth } from './services/auth';

@Component({
  templateUrl: 'build/app.html',
  providers: [
    FIREBASE_PROVIDERS,
    // Initialize Firebase app
    defaultFirebase({
      apiKey: 'AIzaSyDI59kJ3nvFKbvvoctZuyk3IwoYuulzfwQ',
      authDomain: 'timeclock-app.firebaseapp.com',
      databaseURL: 'https://timeclock-app.firebaseio.com',
      storageBucket: 'firebase-timeclock-app.appspot.com',
    }),
    firebaseAuthConfig({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
      remember: 'default',
      scope: ['email']
    }),
    Auth
  ]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, private auth: Auth) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      if (window.location.hash.match(/^#access_token/) && !this.auth.token) {
        this.auth.parseToken();
      } else if (this.auth.token) {
        console.log('found token: ', this.auth.token);
      }
      // this.auth.user = window.localStorage.getItem('user') ? window.localStorage.getItem('user') : this.emptyUser();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp);
