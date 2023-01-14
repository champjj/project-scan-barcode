import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakepointServiceService {
  private _breakPointService = new BehaviorSubject<string>('');
  public get breakPointService() {
    return this._breakPointService;
  }

  constructor(private breakpointObserver: BreakpointObserver) {}

  getBreakepoint() {
    if (this.breakpointObserver.isMatched(Breakpoints.Large)) {
      this.breakPointService.next('Large');
    } else if (this.breakpointObserver.isMatched(Breakpoints.Medium)) {
      this.breakPointService.next('Medium');
    } else if (this.breakpointObserver.isMatched(Breakpoints.Small)) {
      this.breakPointService.next('Small');
    } else if (this.breakpointObserver.isMatched('(min-width: 500px)')) {
      this.breakPointService.next('XSmall');
    }
  }
}
