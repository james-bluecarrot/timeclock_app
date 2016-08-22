import { Component } from '@angular/core';
import { IONIC_DIRECTIVES } from 'ionic-angular';

import { Loader } from '../../services';

@Component({
  selector: 'loading-modal',
  templateUrl: 'build/components/loading-modal/loading-modal.html',
  directives: [IONIC_DIRECTIVES]
})
export class LoadingModal {

  isBusy: boolean;

  constructor(private loader: Loader) {
    this.loader.isBudy.subscribe(res => {
      this.isBusy = res;
    });
  }

}
