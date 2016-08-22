import { Injectable } from '@angular/core';

import { AngularFire } from 'angularfire2';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class Data {

  constructor(private af: AngularFire) {

  }

}
