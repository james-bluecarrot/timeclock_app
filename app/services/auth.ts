import { Injectable, Inject } from '@angular/core';
// import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { InAppBrowser } from 'ionic-native';

@Injectable()
export class Auth {

  user: { displayName: string, uid: string };
  token: Object;

  constructor() {
    this.user = this.emptyUser();
  }

  emptyUser() {
    return { displayName: '', uid: '' };
  }

  loginWithGoogleviaWeb() {
    // build authUrl:
    var authBase = 'https://accounts.google.com/o/oauth2/v2/auth';
    var authParams = {
      response_type: 'token',
      client_id: '707132267777-vc058hae0nrsduarpe5uilggt96ha2oo.apps.googleusercontent.com',
      redirect_uri: window.location.origin,
      scope: ['email', 'openid'].join(' ')
    };
    var params = [];
    for (var k in authParams) {
      params.push(k + '=' + authParams[k]);
    }
    var authUrl = authBase + '?' + params.join('&');
    window.open(authUrl, '_self');
  }

  // TODO: move this to Token constructor?  Token(location.hash)
  parseToken() {
    this.token = {
      created: new Date().getTime()
    }
    var parmStr = location.hash.substring(1); // strip leading hash
    var parms = parmStr.split('&');
    for (var i in parms) {
      var kv = parms[i].split('=');
      this.token[kv[0]] = kv[1];
    }
    console.log(this.token);
  }

  loginWithGoogleUsingPlugin() {
    return Observable.create(observer => {
      // note for iOS the googleplus plugin requires ENABLE_BITCODE to be turned off in the Xcode
      console.log('started');
      window['plugins']['googleplus'].login(
        {
          'scopes': 'email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
          'webClientId': '707132267777-vc058hae0nrsduarpe5uilggt96ha2oo.apps.googleusercontent.com',
          'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function (authData) {
          console.log('got google auth data:', JSON.stringify(authData, null, 2));
          let provider = firebase.auth.GoogleAuthProvider['credential'](authData.idToken, authData.accessToken);
          firebase.auth().signInWithCredential(provider).then((success) => {
            console.log('success!', JSON.stringify(success, null, 2));
            observer.next(success);
          }, (error) => {
            console.log('error', JSON.stringify(error, null, 2));
          });
        },
        function (msg) {
          console.log('Error in login with google plus, ', msg);
        }
      );
    });
  }

  loginWithGoogleUsingWeb() {
    return Observable.create(observer => {
      this.googleWebLogin(tokenData => {
        console.log('got google auth data:', JSON.stringify(tokenData, null, 2));
        // note the underscore_here vs camelCase for google plus oauth plugin
        let provider = firebase.auth.GoogleAuthProvider['credential'](tokenData.id_token, tokenData.access_toekn);
        firebase.auth().signInWithCredential(provider).then((success) => {
          console.log('success!', JSON.stringify(success, null, 2));
          observer.next(success);
        }, (error) => {
          console.log('error', JSON.stringify(error, null, 2));
        });
      });
    });
  }

  // based on https://forum.ionicframework.com/t/how-to-implement-google-oauth-in-an-ionic-2-app/47038/6
  private googleWebLogin(onSuccess: Function) {
    console.log('trying google pure web login...');
    // build authUrl:

    let nonce = (Math.random().toString(36) + '00000').slice(-5);
    let authBase = 'https://accounts.google.com/o/oauth2/v2/auth';

    let redirect_uri = window.location.origin;
    let appFromFile = false;
    if (redirect_uri.indexOf('file://') == 0) {
      appFromFile = true;
      redirect_uri = 'http://localhost';
    }

    let authParams = {
      response_type: 'id_token token', // Firebase require both - id_token token
      nonce: nonce, // required for id_token - then should be verifued
      client_id: '707132267777-vc058hae0nrsduarpe5uilggt96ha2oo.apps.googleusercontent.com',

      redirect_uri: redirect_uri,
      remember: 'none',
      scope: ['email', 'openid', 'profile'].join(' ')
    };
    let params = [];
    for (let k in authParams) {
      params.push(k + '=' + authParams[k]);
    }
    let authUrl = authBase + '?' + params.join('&');

    console.log('authUrl', authUrl);
    // let ref = window.open(authUrl, '_blank');
    let ref = InAppBrowser.open(authUrl, '_system');

    // NOTE for '_self' to work with i.e. ionic serve - dedicatated handler is required as there app will be fully reloaded
    // let ref = window.open(authUrl, appFromFile ? '_blank' : '_self'); // _blank is required for the redired_uri to work

    ref.addEventListener('loadstart', (event: any) => {
      console.log('loadstart for', event.url);
      if ((event.url).startsWith(redirect_uri)) {
        ref.close();
        let response = (event.url).split('#')[1];
        console.debug('oauth response: ' + response);
        onSuccess(this.parseGoogleToken(response));
      }
    });
  }

  private parseGoogleToken(hash: string) {
    let token = {
      created: new Date().getTime()
    };
    let parms = hash.split('&');
    for (let i in parms) {
      let kv = parms[i].split('=');
      token[kv[0]] = kv[1];
    }
    return token;
  }


}
