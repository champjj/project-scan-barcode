import { MediaMatcher } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'project-scan-barcode';
  isMobileDevice$: Observable<boolean>;
  constructor(private _mediaMatcher: MediaMatcher) {
    const { matches } = this._mediaMatcher.matchMedia('(max-width: 468px)');
    this.isMobileDevice$ = of(matches);
  }
}
