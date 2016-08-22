import { Injectable } from '@angular/core';
import { Geolocation } from 'ionic-native';

import { AngularFire } from 'angularfire2';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class Data {

  constructor(private af: AngularFire) { }

  logTime(user: Object) {
    return new Promise((resolve, reject) => {

      Geolocation.getCurrentPosition().then((resp) => {
        let timeLog = {
          user: user,
          timestamp: firebase.database['ServerValue'],
          location: {
            lat: resp.coords.latitude,
            lon: resp.coords.longitude
          }
        };
        console.log(timeLog);
        this.af.database.list('/logging').push(timeLog).then(res => {
          console.log(res);
          resolve(<any>res);
        });
      });

    });
  }

}
