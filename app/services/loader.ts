import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class Loader {

  private loader$: BehaviorSubject<boolean>;

  constructor() {
    this.loader$ = new BehaviorSubject(false);
  }

  get isBudy() {
    return this.loader$.asObservable();
  }

  toggleLoader() {
    this.loader$.next(!this.loader$.getValue());
  }

}
