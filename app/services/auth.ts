import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { InAppBrowser } from 'ionic-native';

export interface IUser { displayName: string; uid: string; email: string; }

@Injectable()
export class Auth {

  private user$: BehaviorSubject<IUser>;

  constructor() {
    this.user$ = new BehaviorSubject<IUser>(this.emptyUser());
  }

  emptyUser() {
    return { displayName: '', uid: '', email: '' };
  }

  getUser() {
    return this.user$.asObservable();
  }

  dispatchUser(user: IUser) {
    this.user$.next(user);
  }

  loginWithGoogleUsingPlugin() {
    return new Promise((resolve, reject) => {
      // note for iOS the googleplus plugin requires ENABLE_BITCODE to be turned off in the Xcode
      // console.log('started');
      window['plugins']['googleplus'].login(
        {
          'scopes': 'email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          'webClientId': '707132267777-vc058hae0nrsduarpe5uilggt96ha2oo.apps.googleusercontent.com',
          'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        (authData) => {
          // console.log('got google auth data:', JSON.stringify(authData, null, 2));
          let provider = firebase.auth.GoogleAuthProvider['credential'](authData.idToken, authData.accessToken);
          firebase.auth().signInWithCredential(provider).then((success) => {
            // console.log('success!', JSON.stringify(success, null, 2));
            this.dispatchUser({ uid: success.uid, displayName: success.displayName, email: success.providerData[0].email });
            resolve(true);
          }, (error) => {
            console.log('error', JSON.stringify(error, null, 2));
            this.dispatchUser(this.emptyUser());
            resolve(false);
          });
        }, (msg) => {
          console.log('Error in login with google plus, ', msg);
          this.dispatchUser(this.emptyUser());
          resolve(false);
        }
      );
    });
  }

}
